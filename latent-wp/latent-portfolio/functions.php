<?php
/**
 * Latent Portfolio — theme bootstrap.
 *
 * The portfolio is one locked stage: it starts ink, each project's pieces
 * lay out in justified rows at their natural aspect ratio and wipe in one
 * by one, the project names stand stacked on the right. Projects are a
 * custom post type, so the client adds work from the WordPress admin.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'LATENT_VERSION', '1.0.0' );
define( 'LATENT_DIR', get_template_directory() );
define( 'LATENT_URI', get_template_directory_uri() );

require LATENT_DIR . '/inc/post-type.php';   // the "Project" post type + its fields
require LATENT_DIR . '/inc/meta-boxes.php';  // the editor: details + the pieces picker
require LATENT_DIR . '/inc/render.php';      // reads projects, prints the stage
require LATENT_DIR . '/inc/customizer.php';  // studio name, contact, links
require LATENT_DIR . '/inc/demo.php';        // Appearance → Latent demo: imports the six sample projects

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'script', 'style' ) );
	add_theme_support( 'responsive-embeds' );
	load_theme_textdomain( 'latent', LATENT_DIR . '/languages' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'latent', get_stylesheet_uri(), array(), LATENT_VERSION ); // fonts are @font-face'd from /assets/fonts
	wp_enqueue_script( 'latent', LATENT_URI . '/assets/portfolio.js', array(), LATENT_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	// the project data the stage script reads (names, meta, piece counts, PDF links)
	wp_add_inline_script( 'latent', 'window.__WK=' . wp_json_encode( latent_projects_json(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ';', 'before' );
} );

// the theme owns the viewport: no admin bar margin pushing the locks around
add_action( 'get_header', function () {
	remove_action( 'wp_head', '_admin_bar_bump_cb' );
} );

// keep the front end free of things that fight the stage (emoji script, block library CSS)
add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}, 100 );
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// mp4 + pdf uploads are part of the job; make sure they are allowed
add_filter( 'upload_mimes', function ( $m ) {
	$m['mp4']  = 'video/mp4';
	$m['webm'] = 'video/webm';
	$m['pdf']  = 'application/pdf';
	return $m;
} );

// [latent_portfolio] — drop the stage into any page, any builder
add_shortcode( 'latent_portfolio', function () {
	ob_start();
	latent_render_stage();
	latent_render_player();
	return ob_get_clean();
} );
