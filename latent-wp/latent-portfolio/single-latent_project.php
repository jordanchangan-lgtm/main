<?php
/** A project's own URL sends the visitor to its place on the stage (#work-N; the stage scrolls there). */
$i = 0;
foreach ( latent_projects() as $k => $p ) { if ( get_the_ID() === $p['id'] ) { $i = $k; break; } }
wp_safe_redirect( home_url( '/#work-' . $i ), 302 );
exit;
