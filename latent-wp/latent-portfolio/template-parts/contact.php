<section class="pg contact" id="contact">
  <div class="in">
    <p class="mono rv">( <?php esc_html_e( 'Contact', 'latent' ); ?> )</p>
    <h2 class="big rv" style="--k:1"><?php esc_html_e( 'Tell us what you make.', 'latent' ); ?><br><a href="mailto:<?php echo esc_attr( latent_opt( 'latent_email', get_bloginfo( 'admin_email' ) ) ); ?>"><?php echo esc_html( latent_opt( 'latent_email', get_bloginfo( 'admin_email' ) ) ); ?></a></h2>
    <div class="tops mono rv" style="--k:2">
      <p class="blk"><b><?php esc_html_e( 'Studio', 'latent' ); ?></b><?php echo esc_html( latent_opt( 'latent_city', 'Amman, Jordan' ) ); ?></p>
      <?php if ( latent_opt( 'latent_phone' ) ) : ?><p class="blk"><b><?php esc_html_e( 'Phone', 'latent' ); ?></b><a href="tel:<?php echo esc_attr( preg_replace( '/[^+\d]/', '', latent_opt( 'latent_phone' ) ) ); ?>">[ <?php echo esc_html( latent_opt( 'latent_phone' ) ); ?> ]</a></p><?php endif; ?>
      <?php if ( latent_opt( 'latent_instagram' ) ) : ?><p class="blk"><b>Instagram</b><a href="<?php echo esc_url( latent_opt( 'latent_instagram' ) ); ?>" target="_blank" rel="noopener">[ <?php echo esc_html( preg_replace( '#^https?://(www\.)?instagram\.com/#', '@', untrailingslashit( latent_opt( 'latent_instagram' ) ) ) ); ?> ]</a></p><?php endif; ?>
      <?php if ( latent_opt( 'latent_linkedin' ) ) : ?><p class="blk"><b>LinkedIn</b><a href="<?php echo esc_url( latent_opt( 'latent_linkedin' ) ); ?>" target="_blank" rel="noopener">[ LinkedIn ]</a></p><?php endif; ?>
    </div>
  </div>
</section>
