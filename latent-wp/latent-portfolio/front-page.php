<?php
/** The front page: intro, the stage, contact. */
get_header();
get_template_part( 'template-parts/intro' );
latent_render_stage();
get_template_part( 'template-parts/about' );
get_template_part( 'template-parts/contact' );
latent_render_player();
get_footer();
