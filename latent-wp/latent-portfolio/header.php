<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0B0B0D">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#work"><?php esc_html_e( 'Skip to the portfolio', 'latent' ); ?></a>
<div class="chrome top" aria-hidden="true"><span class="mono">&ldquo;<?php bloginfo( 'name' ); ?>.&rdquo;</span><span class="mono"><span class="js-clock" data-tz="<?php echo esc_attr( latent_opt( 'latent_timezone', 'Asia/Amman' ) ); ?>">--:--</span> (<?php echo esc_html( latent_opt( 'latent_gmt', 'GMT+3' ) ); ?>) &nbsp;&nbsp; <a href="<?php echo esc_url( home_url( '/#work' ) ); ?>">[ <?php esc_html_e( 'View work', 'latent' ); ?> ]</a></span></div>
<div class="chrome bot" aria-hidden="true"><span class="mono">&copy;<?php echo esc_html( gmdate( 'Y' ) ); ?> <?php esc_html_e( 'all rights reserved', 'latent' ); ?><span class="only-d"> &nbsp;|&nbsp; &ldquo;<?php bloginfo( 'name' ); ?>.&rdquo;</span></span><span class="mono mid"><?php if ( latent_opt( 'latent_instagram' ) ) : ?><a href="<?php echo esc_url( latent_opt( 'latent_instagram' ) ); ?>" target="_blank" rel="noopener">Instagram</a><?php endif; ?><a href="<?php echo esc_url( home_url( '/#contact' ) ); ?>"><?php esc_html_e( 'Contact', 'latent' ); ?></a></span><span class="mono"><?php echo esc_html( latent_opt( 'latent_city', 'Amman, Jordan' ) ); ?></span></div>
