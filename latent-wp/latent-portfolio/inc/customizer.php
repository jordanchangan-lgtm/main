<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Appearance → Customize → Studio: the words in the chrome and the contact panel. */
add_action( 'customize_register', function ( $wp ) {
	$wp->add_section( 'latent_studio', array( 'title' => __( 'Studio', 'latent' ), 'priority' => 30 ) );
	$fields = array(
		'latent_tagline'   => array( __( 'Intro line (under the name)', 'latent' ), 'Campaign imagery and product film without a camera, a set or a crew.', 'textarea' ),
		'latent_city'      => array( __( 'City line', 'latent' ), 'Amman, Jordan', 'text' ),
		'latent_email'     => array( __( 'Email', 'latent' ), 'hello@example.com', 'text' ),
		'latent_phone'     => array( __( 'Phone', 'latent' ), '', 'text' ),
		'latent_instagram' => array( __( 'Instagram URL', 'latent' ), '', 'url' ),
		'latent_linkedin'  => array( __( 'LinkedIn URL', 'latent' ), '', 'url' ),
		'latent_timezone'  => array( __( 'Clock time zone (IANA, e.g. Asia/Amman)', 'latent' ), 'Asia/Amman', 'text' ),
		'latent_gmt'       => array( __( 'Clock label, e.g. GMT+3', 'latent' ), 'GMT+3', 'text' ),
	);
	foreach ( $fields as $id => $f ) {
		$wp->add_setting( $id, array( 'default' => $f[1], 'sanitize_callback' => 'url' === $f[2] ? 'esc_url_raw' : 'sanitize_textarea_field' ) );
		$wp->add_control( $id, array( 'label' => $f[0], 'section' => 'latent_studio', 'type' => $f[2] ) );
	}
} );

function latent_opt( $key, $default = '' ) {
	$v = get_theme_mod( $key, null );
	return null === $v || '' === $v ? $default : $v;
}
