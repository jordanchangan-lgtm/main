<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Two boxes on the Project screen: the details, and the pieces (media library picker, drag to reorder). */
add_action( 'add_meta_boxes_latent_project', function () {
	add_meta_box( 'latent_details', __( 'Project details', 'latent' ), 'latent_box_details', 'latent_project', 'normal', 'high' );
	add_meta_box( 'latent_pieces', __( 'Pieces — images and films, shown at their natural ratio', 'latent' ), 'latent_box_pieces', 'latent_project', 'normal', 'high' );
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'post.php' !== $hook && 'post-new.php' !== $hook ) { return; }
	if ( 'latent_project' !== get_current_screen()->post_type ) { return; }
	wp_enqueue_media();
	wp_enqueue_script( 'jquery-ui-sortable' );
	wp_enqueue_style( 'latent-admin', LATENT_URI . '/assets/admin.css', array(), LATENT_VERSION );
	wp_enqueue_script( 'latent-admin', LATENT_URI . '/assets/admin.js', array( 'jquery', 'jquery-ui-sortable', 'media-editor' ), LATENT_VERSION, true );
	wp_localize_script( 'latent-admin', 'LATENT_ADMIN', array(
		'pick'   => __( 'Choose pieces', 'latent' ),
		'add'    => __( 'Add to project', 'latent' ),
		'poster' => __( 'Choose a poster frame', 'latent' ),
		'use'    => __( 'Use as poster', 'latent' ),
		'film'   => __( 'Film', 'latent' ),
	) );
} );

function latent_box_details( $post ) {
	wp_nonce_field( 'latent_save', 'latent_nonce' );
	$f = function ( $key, $label, $hint = '' ) use ( $post ) {
		printf( '<p><label for="%1$s"><strong>%2$s</strong></label><br><input type="text" class="widefat" id="%1$s" name="%1$s" value="%3$s">%4$s</p>',
			esc_attr( $key ), esc_html( $label ), esc_attr( get_post_meta( $post->ID, $key, true ) ), $hint ? '<span class="description">' . esc_html( $hint ) . '</span>' : '' );
	};
	echo '<div class="latent-grid">';
	$f( '_latent_project', __( 'The work', 'latent' ), __( 'e.g. "Identity + campaign" — the line under the name', 'latent' ) );
	$f( '_latent_sector', __( 'Sector', 'latent' ), __( 'e.g. Perfume, Coffee, Identity', 'latent' ) );
	$f( '_latent_city', __( 'City', 'latent' ) );
	$f( '_latent_year', __( 'Year', 'latent' ) );
	$f( '_latent_filter', __( 'Filter word', 'latent' ), __( 'One short word for the filter row; defaults to the sector', 'latent' ) );
	$f( '_latent_note', __( 'Note', 'latent' ), __( 'One line: what was made — "Logo, palette, type, posters, films"', 'latent' ) );
	echo '</div>';
	$pdf = (int) get_post_meta( $post->ID, '_latent_pdf', true );
	printf( '<p class="latent-pdf"><strong>%s</strong><br><span class="latent-pdf-name">%s</span> <button type="button" class="button js-latent-pdf">%s</button> <button type="button" class="button-link js-latent-pdf-clear"%s>%s</button><input type="hidden" name="_latent_pdf" value="%d"></p>',
		esc_html__( 'PDF to link (optional)', 'latent' ), $pdf ? esc_html( basename( get_attached_file( $pdf ) ) ) : esc_html__( 'None', 'latent' ), esc_html__( 'Choose PDF', 'latent' ), $pdf ? '' : ' hidden', esc_html__( 'Remove', 'latent' ), $pdf );
}

function latent_box_pieces( $post ) {
	$pieces = latent_pieces( $post->ID );
	echo '<p class="description">' . esc_html__( 'Pick images and MP4 films from the Media Library. Drag to reorder. The first piece leads the project; a film first makes the button say "Play the film". Ratios are read from the files, so nothing is ever cropped.', 'latent' ) . '</p>';
	echo '<ul class="latent-pieces js-latent-pieces">';
	foreach ( $pieces as $p ) { latent_piece_row( $p ); }
	echo '</ul>';
	echo '<p><button type="button" class="button button-primary js-latent-add">' . esc_html__( 'Add pieces', 'latent' ) . '</button></p>';
	echo '<input type="hidden" name="_latent_pieces" class="js-latent-pieces-json" value="' . esc_attr( wp_json_encode( $pieces ) ) . '">';
	// a row template the picker clones
	echo '<template class="js-latent-row">';
	latent_piece_row( array( 'id' => 0, 'label' => '', 'poster' => 0, 'ar' => '' ) );
	echo '</template>';
}

function latent_piece_row( $p ) {
	$id     = (int) $p['id'];
	$mime   = $id ? (string) get_post_mime_type( $id ) : '';
	$video  = 0 === strpos( $mime, 'video/' );
	$thumb  = '';
	if ( $id ) {
		$t = $video ? ( $p['poster'] ? wp_get_attachment_image_url( $p['poster'], 'thumbnail' ) : wp_get_attachment_image_url( get_post_thumbnail_id( $id ), 'thumbnail' ) ) : wp_get_attachment_image_url( $id, 'thumbnail' );
		$thumb = $t ? $t : '';
	}
	$ar = $id ? latent_attachment_ar( $id, '' ) : '';
	printf( '<li class="latent-piece%s" data-id="%d" data-poster="%d" data-video="%d"><span class="latent-thumb" style="%s">%s</span><span class="latent-fields"><input type="text" class="js-latent-label" placeholder="%s" value="%s"><span class="latent-ar">%s <em class="js-latent-ar">%s</em></span>%s</span><button type="button" class="button-link js-latent-remove" aria-label="%s">&times;</button></li>',
		$video ? ' is-video' : '', $id, (int) $p['poster'], $video ? 1 : 0, $thumb ? 'background-image:url(' . esc_url( $thumb ) . ')' : '', $video ? '<b>' . esc_html__( 'Film', 'latent' ) . '</b>' : '',
		esc_attr__( 'Label, e.g. "Poster 01" or "Film · 9:16 · 0:20"', 'latent' ), esc_attr( $p['label'] ), esc_html__( 'Ratio', 'latent' ), esc_html( $ar ? $ar : '—' ),
		$video ? '<button type="button" class="button-link js-latent-poster">' . esc_html__( 'Poster frame', 'latent' ) . '</button>' : '', esc_attr__( 'Remove', 'latent' ) );
}

add_action( 'save_post_latent_project', function ( $post_id, $post ) {
	if ( ! isset( $_POST['latent_nonce'] ) || ! wp_verify_nonce( $_POST['latent_nonce'], 'latent_save' ) ) { return; }
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }
	foreach ( array( '_latent_project', '_latent_sector', '_latent_city', '_latent_year', '_latent_filter', '_latent_note' ) as $k ) {
		update_post_meta( $post_id, $k, isset( $_POST[ $k ] ) ? sanitize_text_field( wp_unslash( $_POST[ $k ] ) ) : '' );
	}
	update_post_meta( $post_id, '_latent_pdf', isset( $_POST['_latent_pdf'] ) ? (int) $_POST['_latent_pdf'] : 0 );
	$pieces = isset( $_POST['_latent_pieces'] ) ? json_decode( wp_unslash( $_POST['_latent_pieces'] ), true ) : array();
	$clean  = array();
	if ( is_array( $pieces ) ) {
		foreach ( $pieces as $p ) {
			if ( empty( $p['id'] ) ) { continue; }
			$clean[] = array( 'id' => (int) $p['id'], 'label' => sanitize_text_field( $p['label'] ?? '' ), 'poster' => (int) ( $p['poster'] ?? 0 ), 'ar' => preg_match( '#^\d+/\d+$#', $p['ar'] ?? '' ) ? $p['ar'] : '' );
		}
	}
	update_post_meta( $post_id, '_latent_pieces', wp_slash( wp_json_encode( $clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ) ); // slashed: update_post_meta unslashes
}, 10, 2 );
