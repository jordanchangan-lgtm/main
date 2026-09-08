<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Appearance → Latent demo. One click sideloads the sample media in /demo into
 * the Media Library and creates the six sample projects. Safe to run once;
 * running it again is refused while sample projects exist.
 */
add_action( 'admin_menu', function () {
	add_theme_page( __( 'Latent demo', 'latent' ), __( 'Latent demo', 'latent' ), 'manage_options', 'latent-demo', 'latent_demo_page' );
} );

function latent_demo_page() {
	$done = latent_demo_exists();
	if ( isset( $_POST['latent_import'] ) && check_admin_referer( 'latent_demo' ) && ! $done ) {
		$r = latent_demo_import();
		echo '<div class="notice notice-success"><p>' . esc_html( sprintf( __( 'Imported %1$d projects and %2$d media files.', 'latent' ), $r['projects'], $r['files'] ) ) . '</p></div>';
		$done = true;
	}
	echo '<div class="wrap"><h1>' . esc_html__( 'Latent demo content', 'latent' ) . '</h1>';
	echo '<p>' . esc_html__( 'Creates the six sample projects (41 pieces: films, posters, plates, a brand book PDF) so the stage has something to show. Delete them from Portfolio whenever you like.', 'latent' ) . '</p>';
	if ( $done ) {
		echo '<p><strong>' . esc_html__( 'The demo is already in place.', 'latent' ) . '</strong> <a href="' . esc_url( admin_url( 'edit.php?post_type=latent_project' ) ) . '">' . esc_html__( 'Open Portfolio', 'latent' ) . '</a> · <a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'View the site', 'latent' ) . '</a></p>';
	} else {
		echo '<form method="post">'; wp_nonce_field( 'latent_demo' );
		echo '<p><button class="button button-primary" name="latent_import" value="1">' . esc_html__( 'Import the demo', 'latent' ) . '</button></p></form>';
	}
	echo '</div>';
}

function latent_demo_exists() {
	return (bool) get_posts( array( 'post_type' => 'latent_project', 'post_status' => 'any', 'numberposts' => 1, 'meta_key' => '_latent_demo', 'fields' => 'ids' ) );
}

/** Copy one file from /demo into the uploads folder and register it as an attachment. */
function latent_demo_sideload( $file, $parent = 0 ) {
	static $seen = array();
	if ( isset( $seen[ $file ] ) ) { return $seen[ $file ]; }
	$src = LATENT_DIR . '/demo/' . $file;
	if ( ! file_exists( $src ) ) { return 0; }
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	$up = wp_upload_dir();
	$name = wp_unique_filename( $up['path'], $file );
	$dest = trailingslashit( $up['path'] ) . $name;
	copy( $src, $dest );
	$type = wp_check_filetype( $name );
	$id = wp_insert_attachment( array(
		'post_mime_type' => $type['type'],
		'post_title'     => preg_replace( '/\.[^.]+$/', '', $name ),
		'post_status'    => 'inherit',
		'post_parent'    => $parent,
	), $dest, $parent );
	if ( ! is_wp_error( $id ) ) {
		wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $dest ) );
		$seen[ $file ] = $id;
		return $id;
	}
	return 0;
}

function latent_demo_import() {
	$man = json_decode( file_get_contents( LATENT_DIR . '/demo/manifest.json' ), true );
	$files = 0; $projects = 0;
	foreach ( (array) $man as $order => $p ) {
		$post_id = wp_insert_post( array( 'post_type' => 'latent_project', 'post_status' => 'publish', 'post_title' => $p['title'], 'post_name' => $p['slug'], 'menu_order' => $order ) );
		if ( is_wp_error( $post_id ) ) { continue; }
		$projects++;
		foreach ( array( 'project', 'sector', 'city', 'year', 'note', 'filter' ) as $k ) { update_post_meta( $post_id, '_latent_' . $k, $p[ $k ] ); }
		update_post_meta( $post_id, '_latent_demo', 1 );
		$pieces = array();
		foreach ( $p['media'] as $m ) {
			$id = latent_demo_sideload( $m['file'], $post_id ); if ( ! $id ) { continue; } $files++;
			$poster = 0;
			if ( 'video' === $m['type'] && ! empty( $m['poster'] ) ) {
				$poster = latent_demo_sideload( $m['poster'], $post_id ); if ( $poster ) { $files++; set_post_thumbnail( $id, $poster ); }
			}
			$pieces[] = array( 'id' => $id, 'label' => $m['label'], 'poster' => $poster, 'ar' => $m['ar'] );
			if ( empty( $cover ) ) { $cover = $poster ? $poster : $id; }
		}
		update_post_meta( $post_id, '_latent_pieces', wp_slash( wp_json_encode( $pieces, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ) ); // slashed: update_post_meta unslashes
		if ( ! empty( $pieces ) ) { $first = $pieces[0]; set_post_thumbnail( $post_id, $first['poster'] ? $first['poster'] : $first['id'] ); }
		if ( ! empty( $p['pdf'] ) ) { $pdf = latent_demo_sideload( $p['pdf'], $post_id ); if ( $pdf ) { $files++; update_post_meta( $post_id, '_latent_pdf', $pdf ); } }
	}
	return array( 'projects' => $projects, 'files' => $files );
}
