<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** The "Project" post type. Ordered by the Order box (menu_order), then date. */
add_action( 'init', function () {
	register_post_type( 'latent_project', array(
		'labels' => array(
			'name'               => __( 'Projects', 'latent' ),
			'singular_name'      => __( 'Project', 'latent' ),
			'add_new_item'       => __( 'Add project', 'latent' ),
			'edit_item'          => __( 'Edit project', 'latent' ),
			'new_item'           => __( 'New project', 'latent' ),
			'all_items'          => __( 'All projects', 'latent' ),
			'menu_name'          => __( 'Portfolio', 'latent' ),
			'featured_image'     => __( 'Cover (used in the admin list only)', 'latent' ),
			'not_found'          => __( 'No projects yet. Add one, or import the demo under Appearance → Latent demo.', 'latent' ),
		),
		'public'              => true,
		'publicly_queryable'  => true,
		'has_archive'         => false,
		'exclude_from_search' => true,
		'show_in_rest'        => true,
		'menu_icon'           => 'dashicons-grid-view',
		'menu_position'       => 5,
		'supports'            => array( 'title', 'page-attributes', 'thumbnail' ),
		'rewrite'             => array( 'slug' => 'project', 'with_front' => false ),
	) );

	// the meta fields, registered so they are visible to the REST API and exportable
	$fields = array(
		'_latent_project' => 'string',  // the piece of work: "Élixir 2", "Identity + campaign"
		'_latent_sector'  => 'string',  // Perfume, Coffee, Identity…
		'_latent_city'    => 'string',
		'_latent_year'    => 'string',
		'_latent_note'    => 'string',  // one line under the meta
		'_latent_filter'  => 'string',  // the short word in the filter row; defaults to sector
		'_latent_pdf'     => 'integer', // attachment id of a PDF to link, optional
		'_latent_pieces'  => 'string',  // JSON list of {id, label, poster, ar}
	);
	foreach ( $fields as $key => $type ) {
		register_post_meta( 'latent_project', $key, array(
			'type'          => $type,
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
		) );
	}
} );

/** Admin list: show sector, city, year and the number of pieces. */
add_filter( 'manage_latent_project_posts_columns', function ( $cols ) {
	$out = array();
	foreach ( $cols as $k => $v ) {
		$out[ $k ] = $v;
		if ( 'title' === $k ) {
			$out['latent_meta']   = __( 'Sector · City · Year', 'latent' );
			$out['latent_pieces'] = __( 'Pieces', 'latent' );
			$out['menu_order']    = __( 'Order', 'latent' );
		}
	}
	return $out;
} );
add_action( 'manage_latent_project_posts_custom_column', function ( $col, $id ) {
	if ( 'latent_meta' === $col ) {
		echo esc_html( implode( ' · ', array_filter( array( get_post_meta( $id, '_latent_sector', true ), get_post_meta( $id, '_latent_city', true ), get_post_meta( $id, '_latent_year', true ) ) ) ) );
	} elseif ( 'latent_pieces' === $col ) {
		echo count( latent_pieces( $id ) );
	} elseif ( 'menu_order' === $col ) {
		echo (int) get_post( $id )->menu_order;
	}
}, 10, 2 );
add_filter( 'manage_edit-latent_project_sortable_columns', function ( $c ) { $c['menu_order'] = 'menu_order'; return $c; } );

/** The pieces of one project as a clean list: [ ['id'=>int,'label'=>str,'poster'=>int,'ar'=>str], … ]. */
function latent_pieces( $post_id ) {
	$raw = get_post_meta( $post_id, '_latent_pieces', true );
	$list = is_string( $raw ) && '' !== $raw ? json_decode( $raw, true ) : array();
	if ( ! is_array( $list ) ) { return array(); }
	$out = array();
	foreach ( $list as $p ) {
		if ( empty( $p['id'] ) || ! get_post( (int) $p['id'] ) ) { continue; }
		$out[] = array(
			'id'     => (int) $p['id'],
			'label'  => isset( $p['label'] ) ? (string) $p['label'] : '',
			'poster' => isset( $p['poster'] ) ? (int) $p['poster'] : 0,
			'ar'     => isset( $p['ar'] ) ? (string) $p['ar'] : '',
		);
	}
	return $out;
}
