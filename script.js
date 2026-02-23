document.addEventListener("DOMContentLoaded", () => {
	const links = document.querySelectorAll("nav a[data-page]");
	const mobileLinks = document.querySelectorAll(".mobile-link");
	const pages = document.querySelectorAll(".page");
	const nav = document.getElementById("mainNav");
	const body = document.body;
	const hamburger = document.getElementById("hamburger");
	const mobileMenu = document.getElementById("mobileMenu");

	const pageColors = {
		about: "#f5a000",
		experience: "#b9a3d6",
		projects: "#6cd4ff",
		contact: "#8ef59b",
	};

	document.getElementById("about").classList.add("active");
	document.querySelector('nav a[data-page="about"]').classList.add("active");
	nav.style.backgroundColor = pageColors.about;
	body.style.backgroundColor = pageColors.about;

	function switchPage(pageId) {
		pages.forEach((p) => p.classList.remove("active"));
		const target = document.getElementById(pageId);
		if (target) target.classList.add("active");
		const color = pageColors[pageId];
		if (color) {
			nav.style.backgroundColor = color;
			body.style.backgroundColor = color;
		}
		links.forEach((l) => l.classList.remove("active"));
		const al = document.querySelector(`nav a[data-page="${pageId}"]`);
		if (al) al.classList.add("active");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	links.forEach((l) =>
		l.addEventListener("click", (e) => {
			e.preventDefault();
			switchPage(l.dataset.page);
		}),
	);
	mobileLinks.forEach((l) =>
		l.addEventListener("click", (e) => {
			e.preventDefault();
			switchPage(l.dataset.page);
			closeMobile();
		}),
	);

	function closeMobile() {
		hamburger.classList.remove("open");
		mobileMenu.classList.remove("open");
		body.style.overflow = "";
	}

	hamburger.addEventListener("click", () => {
		const open = hamburger.classList.toggle("open");
		mobileMenu.classList.toggle("open", open);
		body.style.overflow = open ? "hidden" : "";
	});

	// ── PROJECTS SCROLL ──
	const track = document.getElementById("projectsTrack");
	const wrap = track ? track.closest(".projects-track-wrap") : null;

	if (track && wrap) {
		track.style.overflowX = "scroll";
		track.style.scrollbarWidth = "none";
		track.style.msOverflowStyle = "none";

		// Two-finger / trackpad scroll
		let resumeTimer;
		function pauseThenResume() {
			track.style.animationPlayState = "paused";
			clearTimeout(resumeTimer);
			resumeTimer = setTimeout(() => {
				track.style.animationPlayState = "running";
			}, 1500);
		}

		wrap.addEventListener(
			"wheel",
			(e) => {
				if (Math.abs(e.deltaX) > 0 || e.shiftKey) {
					e.preventDefault();
					track.scrollLeft += e.deltaX || e.deltaY;
					pauseThenResume();
				}
			},
			{ passive: false },
		);

		// Inject left + right arrow buttons inside the wrap
		const btnLeft = document.createElement("button");
		btnLeft.className = "proj-btn proj-btn--left";
		btnLeft.innerHTML = "&#8592;";

		const btnRight = document.createElement("button");
		btnRight.className = "proj-btn proj-btn--right";
		btnRight.innerHTML = "&#8594;";

		wrap.appendChild(btnLeft);
		wrap.appendChild(btnRight);

		const STEP = 400;

		btnLeft.addEventListener("click", () => {
			track.scrollLeft -= STEP;
			pauseThenResume();
		});

		btnRight.addEventListener("click", () => {
			track.scrollLeft += STEP;
			pauseThenResume();
		});
	}

	const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;
	if (!isTouchDevice()) {
		const inner = document.getElementById("cursorInner");
		const outer = document.getElementById("cursorOuter");
		let mx = 0,
			my = 0,
			ox = 0,
			oy = 0;

		document.addEventListener("mousemove", (e) => {
			mx = e.clientX;
			my = e.clientY;
			inner.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
		});

		(function follow() {
			ox += (mx - ox) * 0.14;
			oy += (my - oy) * 0.14;
			outer.style.transform = `translate(${ox}px,${oy}px) translate(-50%,-50%)`;
			requestAnimationFrame(follow);
		})();
	}
});
