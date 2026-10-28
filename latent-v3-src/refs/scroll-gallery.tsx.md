# 21st.dev ScrollGallery (React + GSAP) — the source the vanilla port in e_patch_gallery.py follows
Mechanism: pinned stage; first image visible; each next image masked with a `linear-gradient` of N horizontal strips
(strip j delayed j/N*0.5, reveal speed 2); active image scales from 1.25 to 1 across two transitions
(step = range/2); title slides out by ±120% then in from the opposite side when progress within a transition
passes 0.3; a prefix label left and a CTA link right that updates per slide. Studio preset: white 36px text,
band border white/20, 36px padding, 18px on phones.
