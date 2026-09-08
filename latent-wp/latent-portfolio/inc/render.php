<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Natural aspect ratio of an attachment as "w/h". Images and videos both carry width/height in their metadata. */
function latent_attachment_ar( $id, $fallback = '4/5' ) {
	$m = wp_get_attachment_metadata( $id );
	if ( is_array( $m ) && ! empty( $m['width'] ) && ! empty( $m['height'] ) ) {
		return (int) $m['width'] . '/' . (int) $m['height'];
	}
	return $fallback;
}

/** All published projects, in order, with everything the stage needs. */
function latent_projects() {
	static $cache = null;
	if ( null !== $cache ) { return $cache; }
	$posts = get_posts( array(
		'post_type'      => 'latent_project',
		'post_status'    => 'publish',
		'numberposts'    => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'ASC' ),
		'no_found_rows'  => true,
	) );
	$cache = array();
	foreach ( $posts as $post ) {
		$id     = $post->ID;
		$pieces = array();
		foreach ( latent_pieces( $id ) as $p ) {
			$mime  = get_post_mime_type( $p['id'] );
			$video = 0 === strpos( (string) $mime, 'video/' );
			$piece = array(
				'video'  => $video,
				'src'    => wp_get_attachment_url( $p['id'] ),
				'label'  => $p['label'],
				'ar'     => $p['ar'] ? $p['ar'] : latent_attachment_ar( $p['id'] ),
				'alt'    => get_post_meta( $p['id'], '_wp_attachment_image_alt', true ),
				'poster' => '',
				'dur'    => '',
				'srcset' => '',
				'sizes'  => '',
			);
			if ( $video ) {
				$poster_id = $p['poster'] ? $p['poster'] : (int) get_post_thumbnail_id( $p['id'] );
				$piece['poster'] = $poster_id ? wp_get_attachment_url( $poster_id ) : '';
				$m = wp_get_attachment_metadata( $p['id'] );
				if ( is_array( $m ) && ! empty( $m['length'] ) ) {
					$piece['dur'] = floor( $m['length'] / 60 ) . ':' . str_pad( $m['length'] % 60, 2, '0', STR_PAD_LEFT );
				}
				if ( ! $piece['ar'] || '4/5' === $piece['ar'] ) {
					// a poster knows the frame size when the video metadata does not
					if ( $poster_id ) { $piece['ar'] = latent_attachment_ar( $poster_id, $piece['ar'] ); }
				}
			} else {
				// responsive sources so the browser picks a sensible size for the tile
				$piece['srcset'] = (string) wp_get_attachment_image_srcset( $p['id'], 'full' );
				$piece['sizes']  = '(max-width: 899px) 100vw, 56vw';
			}
			$pieces[] = $piece;
		}
		$pdf_id = (int) get_post_meta( $id, '_latent_pdf', true );
		$pdf    = $pdf_id ? wp_get_attachment_url( $pdf_id ) : '';
		$sector = get_post_meta( $id, '_latent_sector', true );
		$filter = get_post_meta( $id, '_latent_filter', true );
		$cache[] = array(
			'id'      => $id,
			'title'   => get_the_title( $post ),
			'project' => get_post_meta( $id, '_latent_project', true ),
			'sector'  => $sector,
			'city'    => get_post_meta( $id, '_latent_city', true ),
			'year'    => get_post_meta( $id, '_latent_year', true ),
			'note'    => get_post_meta( $id, '_latent_note', true ),
			'filter'  => $filter ? $filter : $sector,
			'pdf'     => $pdf,
			'pdf_mb'  => $pdf_id && file_exists( get_attached_file( $pdf_id ) ) ? round( filesize( get_attached_file( $pdf_id ) ) / 1048576, 1 ) : 0,
			'pieces'  => $pieces,
		);
	}
	return $cache;
}

/** The small JSON the stage script reads: one row per project. */
function latent_projects_json() {
	$out = array();
	foreach ( latent_projects() as $p ) {
		$out[] = array(
			't'    => $p['title'],
			'proj' => $p['project'],
			'meta' => implode( ' · ', array_filter( array( $p['sector'], $p['city'], $p['year'] ) ) ),
			'note' => $p['note'],
			'n'    => count( $p['pieces'] ),
			'film' => ! empty( $p['pieces'] ) && $p['pieces'][0]['video'],
			'pdf'  => $p['pdf'],
			'pdfl' => $p['pdf'] ? sprintf( '[ %s · PDF%s ]', __( 'Open the book', 'latent' ), $p['pdf_mb'] ? ' · ' . $p['pdf_mb'] . ' MB' : '' ) : '',
		);
	}
	return $out;
}

function latent_pad2( $n ) { return str_pad( (int) $n, 2, '0', STR_PAD_LEFT ); }

/** One tile. Natural ratio in --ar; --k staggers the wipe. */
function latent_render_piece( $p, $piece, $i, $k ) {
	$note = esc_attr( implode( ' · ', array_filter( array( $piece['label'], $p['city'], $p['year'] ) ) ) );
	$attrs = sprintf( 'class="wk-m js-open" style="--k:%d;--ar:%s" data-i="%d" data-title="%s" data-client="%s" data-note="%s"', $k, esc_attr( $piece['ar'] ), $i, esc_attr( $p['title'] ), esc_attr( $p['project'] ), $note );
	if ( $piece['video'] ) {
		printf( '<figure %s data-dur="%s"><video class="js-tile-v" muted loop playsinline preload="metadata"%s src="%s"></video><span class="play">[ %s ]</span></figure>' . "\n",
			$attrs, esc_attr( $piece['dur'] ? $piece['dur'] : '0:10' ), $piece['poster'] ? ' poster="' . esc_url( $piece['poster'] ) . '"' : '', esc_url( $piece['src'] ), esc_html__( 'Play', 'latent' ) );
	} else {
		printf( '<figure %s data-img="1"><img src="%s"%s alt="%s" loading="lazy" decoding="async"><span class="play">[ %s ]</span></figure>' . "\n",
			$attrs, esc_url( $piece['src'] ), $piece['srcset'] ? ' srcset="' . esc_attr( $piece['srcset'] ) . '" sizes="' . esc_attr( $piece['sizes'] ) . '"' : '', esc_attr( $piece['alt'] ? $piece['alt'] : $piece['label'] ), esc_html__( 'Open', 'latent' ) );
	}
}

/** The stage. */
function latent_render_stage() {
	$projects = latent_projects();
	$n = count( $projects );
	if ( ! $n ) {
		echo '<section class="pg wk-empty" id="work"><div class="in"><p class="mono">' . esc_html__( 'No projects yet. Add them under Portfolio, or import the demo under Appearance → Latent demo.', 'latent' ) . '</p></div></section>';
		return;
	}
	?>
<section class="pg work wk" id="work">
  <div class="wk-hold js-wk-hold">
    <div class="wk-stage js-wk-stage">
      <div class="head wk-head">
        <p class="mono filter js-wk-filter"><b>( <?php esc_html_e( 'Portfolio', 'latent' ); ?> )</b><?php foreach ( $projects as $i => $p ) : ?><span data-i="<?php echo (int) $i; ?>"<?php echo 0 === $i ? ' class="on"' : ''; ?>><?php echo esc_html( $p['filter'] ); ?></span><?php endforeach; ?></p>
        <h2 class="title"><?php esc_html_e( 'Portfolio', 'latent' ); ?><sup>[ <?php echo (int) $n; ?> ]</sup></h2>
        <p class="mono count"><span class="js-wk-count">&mdash; / <?php echo esc_html( latent_pad2( $n ) ); ?></span></p>
      </div>
      <div class="wk-body">
        <div class="wk-media js-wk-media">
<?php foreach ( $projects as $i => $p ) : ?>
          <div class="wk-set js-wk-set" data-i="<?php echo (int) $i; ?>"><div class="wk-in">
<?php foreach ( $p['pieces'] as $k => $piece ) { latent_render_piece( $p, $piece, $i, $k ); } ?>
          </div></div>
<?php endforeach; ?>
        </div>
        <div class="wk-text">
          <h3 class="stk wk-stk js-wk-stk in" aria-live="polite">
<?php foreach ( $projects as $i => $p ) : ?>
            <span class="stk-l" data-i="<?php echo esc_attr( latent_pad2( $i + 1 ) ); ?>" style="--k:<?php echo (int) $i; ?>"><?php echo esc_html( $p['title'] ); ?></span>
<?php endforeach; ?>
          </h3>
          <p class="wk-proj swap js-wk-proj"></p>
          <p class="mono wk-meta swap js-wk-meta"></p>
          <p class="wk-note swap js-wk-note"></p>
          <p class="mono wk-cta"><button type="button" class="js-wk-open">[ <?php esc_html_e( 'Open full frame', 'latent' ); ?> ]</button><span class="js-wk-n"></span></p>
          <p class="mono wk-cta wk-pdf"><a class="js-wk-pdf" href="#" target="_blank" rel="noopener" hidden></a></p>
        </div>
      </div>
      <p class="mono wk-cue" aria-hidden="true"><span><?php esc_html_e( 'Scroll', 'latent' ); ?></span><i></i></p>
    </div>
  </div>
</section>
	<?php
}

/** The full-frame player / lightbox the tiles open into. Print once per page. */
function latent_render_player() {
	static $done = false;
	if ( $done ) { return; }
	$done = true;
	?>
<div class="fm js-fm" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Work', 'latent' ); ?>" hidden>
  <div class="fm-head"><p class="fm-t"><span class="js-fm-title"></span> <span class="sep">|</span> <span class="cl js-fm-client"></span></p><p class="mono"><span class="js-fm-note"></span> &nbsp;&nbsp; <span class="js-fm-time"></span></p></div>
  <div class="fm-stage js-fm-stage"><video class="js-fm-v" playsinline preload="metadata"></video><img class="js-fm-img" alt="" hidden><span class="fm-state js-fm-state">[ <?php esc_html_e( 'Pause', 'latent' ); ?> ]</span></div>
  <button type="button" class="fm-x js-fm-close">[ <?php esc_html_e( 'Close', 'latent' ); ?> ]</button>
</div>
	<?php
}
