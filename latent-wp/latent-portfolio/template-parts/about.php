<?php
/** The About panel. Text is a WordPress Page chosen in Customize → Studio; its featured image is the blurred ground. */
$about_id = (int) latent_opt( 'latent_about_page', 0 );
$about    = $about_id ? get_post( $about_id ) : null;
if ( ! $about || 'publish' !== $about->post_status ) { return; }
$ground   = get_the_post_thumbnail_url( $about, 'large' );
$creds    = array_filter( array( latent_opt( 'latent_cred_1' ), latent_opt( 'latent_cred_2' ), latent_opt( 'latent_cred_3' ) ) );
?>
<section class="pg about" id="about">
  <?php if ( $ground ) : ?><div class="bg"><img src="<?php echo esc_url( $ground ); ?>" alt="" loading="lazy" decoding="async"></div><?php endif; ?>
  <div class="in">
    <div class="top rv">
      <h2 class="lbl"><?php echo esc_html( get_the_title( $about ) ); ?></h2>
      <div class="txt"><?php echo wp_kses_post( apply_filters( 'the_content', $about->post_content ) ); ?></div>
    </div>
    <?php if ( $creds ) : ?>
    <div class="creds mono rv" style="--k:2">
      <?php foreach ( $creds as $c ) : $lines = preg_split( '/\r?\n/', trim( $c ) ); $head = array_shift( $lines ); ?>
      <p><b><?php echo esc_html( $head ); ?></b><?php echo wp_kses( implode( '<br>', array_map( 'esc_html', $lines ) ), array( 'br' => array() ) ); ?></p>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <p class="mono back rv" style="--k:3"><a href="<?php echo esc_url( home_url( '/#work' ) ); ?>">[ <?php esc_html_e( 'Back to the portfolio', 'latent' ); ?> ]</a></p>
  </div>
</section>
