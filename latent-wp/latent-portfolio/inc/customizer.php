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
	$fields['latent_cred_1'] = array( __( 'About · credit column 1 (first line is the heading)', 'latent' ), "Direction & production\nYour studio\nYour city", 'textarea' );
	$fields['latent_cred_2'] = array( __( 'About · credit column 2', 'latent' ), "Sectors\nCosmetics · coffee · clothing\njewellery · perfume · brands", 'textarea' );
	$fields['latent_cred_3'] = array( __( 'About · credit column 3', 'latent' ), "Method\nBrief · direction\nframes · delivery", 'textarea' );
	// the About page: any WordPress Page; its text becomes the About panel, its featured image the ground
	$wp->add_setting( 'latent_about_page', array( 'default' => 0, 'sanitize_callback' => 'absint' ) );
	$wp->add_control( 'latent_about_page', array( 'label' => __( 'About page', 'latent' ), 'description' => __( 'Its title and text make the About panel; set a featured image on it for the blurred ground.', 'latent' ), 'section' => 'latent_studio', 'type' => 'dropdown-pages', 'allow_addition' => true ) );
	foreach ( $fields as $id => $f ) {
		$wp->add_setting( $id, array( 'default' => $f[1], 'sanitize_callback' => 'url' === $f[2] ? 'esc_url_raw' : 'sanitize_textarea_field' ) );
		$wp->add_control( $id, array( 'label' => $f[0], 'section' => 'latent_studio', 'type' => $f[2] ) );
	}
} );

function latent_opt( $key, $default = '' ) {
	$v = get_theme_mod( $key, null );
	return null === $v || '' === $v ? $default : $v;
}

/** The About page shows the studio's own address in the top chrome. */
function latent_about_url() {
	$id = (int) latent_opt( 'latent_about_page', 0 );
	return $id ? get_permalink( $id ) : '';
}
