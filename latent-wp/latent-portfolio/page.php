<?php
/** A page on its own URL. The About page gets its panel; any other page gets the plain panel. */
get_header();
if ( get_the_ID() === (int) latent_opt( 'latent_about_page', 0 ) ) {
	get_template_part( 'template-parts/about' );
} else {
	while ( have_posts() ) : the_post(); ?>
<section class="pg plain">
  <div class="in">
    <article>
      <h1><?php the_title(); ?></h1>
      <div class="entry"><?php the_content(); ?></div>
    </article>
  </div>
</section>
<?php endwhile;
}
get_footer();
