<?php
/** Anything else WordPress asks for: a plain, quiet panel. */
get_header();
?>
<section class="pg plain">
  <div class="in">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <article>
      <h1><?php the_title(); ?></h1>
      <div class="entry"><?php the_content(); ?></div>
    </article>
<?php endwhile; else : ?>
    <h1><?php esc_html_e( 'Nothing here.', 'latent' ); ?></h1>
    <p class="mono"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">[ <?php esc_html_e( 'Back to the portfolio', 'latent' ); ?> ]</a></p>
<?php endif; ?>
  </div>
</section>
<?php
get_footer();
