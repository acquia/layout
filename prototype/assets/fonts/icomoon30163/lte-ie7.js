/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'IcoMoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-home' : '&#xe000;',
			'icon-home-2' : '&#xe001;',
			'icon-newspaper' : '&#xe002;',
			'icon-pencil' : '&#xe003;',
			'icon-pencil-2' : '&#xe004;',
			'icon-droplet' : '&#xe005;',
			'icon-picture' : '&#xe006;',
			'icon-picture-2' : '&#xe007;',
			'icon-camera' : '&#xe008;',
			'icon-music' : '&#xe009;',
			'icon-play' : '&#xe00a;',
			'icon-film' : '&#xe00b;',
			'icon-camera-2' : '&#xe00c;',
			'icon-spades' : '&#xe00d;',
			'icon-clubs' : '&#xe00e;',
			'icon-diamonds' : '&#xe00f;',
			'icon-broadcast' : '&#xe010;',
			'icon-microphone' : '&#xe011;',
			'icon-book' : '&#xe012;',
			'icon-paper' : '&#xe013;',
			'icon-paper-2' : '&#xe014;',
			'icon-new' : '&#xe015;',
			'icon-copy' : '&#xe016;',
			'icon-folder' : '&#xe017;',
			'icon-folder-2' : '&#xe018;',
			'icon-tag' : '&#xe019;',
			'icon-cart' : '&#xe01a;',
			'icon-basket' : '&#xe01b;',
			'icon-calculate' : '&#xe01c;',
			'icon-support' : '&#xe01d;',
			'icon-phone' : '&#xe01e;',
			'icon-mail' : '&#xe01f;',
			'icon-location' : '&#xe020;',
			'icon-compass' : '&#xe021;',
			'icon-history' : '&#xe022;',
			'icon-clock' : '&#xe023;',
			'icon-bell' : '&#xe024;',
			'icon-bell-2' : '&#xe025;',
			'icon-bell-3' : '&#xe026;',
			'icon-calendar' : '&#xe027;',
			'icon-mouse' : '&#xe028;',
			'icon-screen' : '&#xe029;',
			'icon-laptop' : '&#xe02a;',
			'icon-mobile' : '&#xe02b;',
			'icon-tablet' : '&#xe02c;',
			'icon-mobile-2' : '&#xe02d;',
			'icon-drawer' : '&#xe02e;',
			'icon-drawer-2' : '&#xe02f;',
			'icon-box-add' : '&#xe030;',
			'icon-box-remove' : '&#xe031;',
			'icon-database' : '&#xe032;',
			'icon-undo' : '&#xe033;',
			'icon-redo' : '&#xe034;',
			'icon-forward' : '&#xe035;',
			'icon-reply' : '&#xe036;',
			'icon-reply-2' : '&#xe037;',
			'icon-comments' : '&#xe038;',
			'icon-comments-2' : '&#xe039;',
			'icon-comments-3' : '&#xe03a;',
			'icon-comments-4' : '&#xe03b;',
			'icon-comments-5' : '&#xe03c;',
			'icon-comments-6' : '&#xe03d;',
			'icon-user' : '&#xe03e;',
			'icon-user-2' : '&#xe03f;',
			'icon-user-3' : '&#xe040;',
			'icon-busy' : '&#xe041;',
			'icon-loading' : '&#xe042;',
			'icon-loading-2' : '&#xe043;',
			'icon-search' : '&#xe044;',
			'icon-search-2' : '&#xe045;',
			'icon-zoom-in' : '&#xe046;',
			'icon-zoom-out' : '&#xe047;',
			'icon-key' : '&#xe048;',
			'icon-key-2' : '&#xe049;',
			'icon-locked' : '&#xe04a;',
			'icon-unlocked' : '&#xe04b;',
			'icon-wrench' : '&#xe04c;',
			'icon-equalizer' : '&#xe04d;',
			'icon-cog' : '&#xe04e;',
			'icon-pie' : '&#xe04f;',
			'icon-bars' : '&#xe050;',
			'icon-stats-up' : '&#xe051;',
			'icon-gift' : '&#xe052;',
			'icon-trophy' : '&#xe053;',
			'icon-diamond' : '&#xe054;',
			'icon-coffee' : '&#xe055;',
			'icon-rocket' : '&#xe056;',
			'icon-meter-slow' : '&#xe057;',
			'icon-meter-medium' : '&#xe058;',
			'icon-meter-fast' : '&#xe059;',
			'icon-dashboard' : '&#xe05a;',
			'icon-fire' : '&#xe05b;',
			'icon-lab' : '&#xe05c;',
			'icon-remove' : '&#xe05d;',
			'icon-remove-2' : '&#xe05e;',
			'icon-remove-3' : '&#xe05f;',
			'icon-briefcase' : '&#xe060;',
			'icon-briefcase-2' : '&#xe061;',
			'icon-cars' : '&#xe062;',
			'icon-bus' : '&#xe063;',
			'icon-cube' : '&#xe064;',
			'icon-cube-2' : '&#xe065;',
			'icon-puzzle' : '&#xe066;',
			'icon-glasses' : '&#xe067;',
			'icon-glasses-2' : '&#xe068;',
			'icon-accessibility' : '&#xe069;',
			'icon-accessibility-2' : '&#xe06a;',
			'icon-target' : '&#xe06b;',
			'icon-target-2' : '&#xe06c;',
			'icon-lightning' : '&#xe06d;',
			'icon-power' : '&#xe06e;',
			'icon-power-2' : '&#xe06f;',
			'icon-clipboard' : '&#xe070;',
			'icon-clipboard-2' : '&#xe071;',
			'icon-playlist' : '&#xe072;',
			'icon-grid-view' : '&#xe073;',
			'icon-tree-view' : '&#xe074;',
			'icon-menu' : '&#xe075;',
			'icon-menu-2' : '&#xe076;',
			'icon-cloud' : '&#xe077;',
			'icon-cloud-2' : '&#xe078;',
			'icon-download' : '&#xe079;',
			'icon-upload' : '&#xe07a;',
			'icon-upload-2' : '&#xe07b;',
			'icon-link' : '&#xe07c;',
			'icon-link-2' : '&#xe07d;',
			'icon-flag' : '&#xe07e;',
			'icon-flag-2' : '&#xe07f;',
			'icon-flag-3' : '&#xe080;',
			'icon-eye' : '&#xe081;',
			'icon-eye-2' : '&#xe082;',
			'icon-bookmark' : '&#xe083;',
			'icon-bookmark-2' : '&#xe084;',
			'icon-star' : '&#xe085;',
			'icon-star-2' : '&#xe086;',
			'icon-star-3' : '&#xe087;',
			'icon-heart' : '&#xe088;',
			'icon-heart-2' : '&#xe089;',
			'icon-thumbs-up' : '&#xe08a;',
			'icon-thumbs-down' : '&#xe08b;',
			'icon-happy' : '&#xe08c;',
			'icon-smiley' : '&#xe08d;',
			'icon-neutral' : '&#xe08e;',
			'icon-plus' : '&#xe08f;',
			'icon-minus' : '&#xe090;',
			'icon-help' : '&#xe091;',
			'icon-help-2' : '&#xe092;',
			'icon-info' : '&#xe093;',
			'icon-blocked' : '&#xe094;',
			'icon-cancel' : '&#xe095;',
			'icon-cancel-2' : '&#xe096;',
			'icon-cancel-3' : '&#xe097;',
			'icon-checkmark' : '&#xe098;',
			'icon-minus-2' : '&#xe099;',
			'icon-plus-2' : '&#xe09a;',
			'icon-enter' : '&#xe09b;',
			'icon-exit' : '&#xe09c;',
			'icon-loop' : '&#xe09d;',
			'icon-arrow-up' : '&#xe09e;',
			'icon-arrow-right' : '&#xe09f;',
			'icon-arrow-down' : '&#xe0a0;',
			'icon-arrow-left' : '&#xe0a1;',
			'icon-arrow-up-left' : '&#xe0a2;',
			'icon-arrow-up-2' : '&#xe0a3;',
			'icon-arrow-up-right' : '&#xe0a4;',
			'icon-arrow-right-2' : '&#xe0a5;',
			'icon-arrow-down-right' : '&#xe0a6;',
			'icon-arrow-down-2' : '&#xe0a7;',
			'icon-arrow-down-left' : '&#xe0a8;',
			'icon-arrow-left-2' : '&#xe0a9;',
			'icon-arrow-up-left-2' : '&#xe0aa;',
			'icon-arrow-up-3' : '&#xe0ab;',
			'icon-arrow-up-right-2' : '&#xe0ac;',
			'icon-arrow-right-3' : '&#xe0ad;',
			'icon-arrow-down-right-2' : '&#xe0ae;',
			'icon-arrow-down-3' : '&#xe0af;',
			'icon-arrow-down-left-2' : '&#xe0b0;',
			'icon-arrow-left-3' : '&#xe0b1;',
			'icon-arrow-up-left-3' : '&#xe0b2;',
			'icon-arrow-up-4' : '&#xe0b3;',
			'icon-arrow-up-right-3' : '&#xe0b4;',
			'icon-arrow-right-4' : '&#xe0b5;',
			'icon-arrow-down-right-3' : '&#xe0b6;',
			'icon-arrow-down-4' : '&#xe0b7;',
			'icon-arrow-down-left-3' : '&#xe0b8;',
			'icon-arrow-left-4' : '&#xe0b9;',
			'icon-arrow-up-5' : '&#xe0ba;',
			'icon-arrow-right-5' : '&#xe0bb;',
			'icon-arrow-down-5' : '&#xe0bc;',
			'icon-arrow-left-5' : '&#xe0bd;',
			'icon-arrow-up-6' : '&#xe0be;',
			'icon-arrow-right-6' : '&#xe0bf;',
			'icon-arrow-down-6' : '&#xe0c0;',
			'icon-arrow-left-6' : '&#xe0c1;',
			'icon-arrow-up-7' : '&#xe0c2;',
			'icon-arrow-right-7' : '&#xe0c3;',
			'icon-arrow-down-7' : '&#xe0c4;',
			'icon-arrow-left-7' : '&#xe0c5;',
			'icon-menu-3' : '&#xe0c6;',
			'icon-enter-2' : '&#xe0c7;',
			'icon-backspace' : '&#xe0c8;',
			'icon-backspace-2' : '&#xe0c9;',
			'icon-tab' : '&#xe0ca;',
			'icon-tab-2' : '&#xe0cb;',
			'icon-checkbox' : '&#xe0cc;',
			'icon-checkbox-unchecked' : '&#xe0cd;',
			'icon-checkbox-partial' : '&#xe0ce;',
			'icon-radio-checked' : '&#xe0cf;',
			'icon-radio-unchecked' : '&#xe0d0;',
			'icon-font' : '&#xe0d1;',
			'icon-paragraph-left' : '&#xe0d2;',
			'icon-paragraph-center' : '&#xe0d3;',
			'icon-paragraph-right' : '&#xe0d4;',
			'icon-left-to-right' : '&#xe0d5;',
			'icon-right-to-left' : '&#xe0d6;',
			'icon-out' : '&#xe0d7;',
			'icon-out-2' : '&#xe0d8;',
			'icon-embed' : '&#xe0d9;',
			'icon-seven-segment' : '&#xe0da;',
			'icon-seven-segment-2' : '&#xe0db;',
			'icon-seven-segment-3' : '&#xe0dc;',
			'icon-seven-segment-4' : '&#xe0dd;',
			'icon-seven-segment-5' : '&#xe0de;',
			'icon-seven-segment-6' : '&#xe0df;',
			'icon-seven-segment-7' : '&#xe0e0;',
			'icon-seven-segment-8' : '&#xe0e1;',
			'icon-seven-segment-9' : '&#xe0e2;',
			'icon-seven-segment-10' : '&#xe0e3;',
			'icon-bluetooth' : '&#xe0e4;',
			'icon-share' : '&#xe0e5;',
			'icon-share-2' : '&#xe0e6;',
			'icon-mail-2' : '&#xe0e7;',
			'icon-mail-3' : '&#xe0e8;',
			'icon-google-plus' : '&#xe0e9;',
			'icon-google-plus-2' : '&#xe0ea;',
			'icon-google-plus-3' : '&#xe0eb;',
			'icon-gplus' : '&#xe0ec;',
			'icon-facebook' : '&#xe0ed;',
			'icon-facebook-2' : '&#xe0ee;',
			'icon-facebook-3' : '&#xe0ef;',
			'icon-facebook-4' : '&#xe0f0;',
			'icon-twitter' : '&#xe0f1;',
			'icon-twitter-2' : '&#xe0f2;',
			'icon-twitter-3' : '&#xe0f3;',
			'icon-feed' : '&#xe0f4;',
			'icon-feed-2' : '&#xe0f5;',
			'icon-feed-3' : '&#xe0f6;',
			'icon-youtube' : '&#xe0f7;',
			'icon-youtube-2' : '&#xe0f8;',
			'icon-vimeo' : '&#xe0f9;',
			'icon-vimeo-2' : '&#xe0fa;',
			'icon-flickr' : '&#xe0fb;',
			'icon-flickr-2' : '&#xe0fc;',
			'icon-flickr-3' : '&#xe0fd;',
			'icon-picassa' : '&#xe0fe;',
			'icon-picassa-2' : '&#xe0ff;',
			'icon-dribbble' : '&#xe100;',
			'icon-dribbble-2' : '&#xe101;',
			'icon-dribbble-3' : '&#xe102;',
			'icon-forrst' : '&#xe103;',
			'icon-forrst-2' : '&#xe104;',
			'icon-deviantart' : '&#xe105;',
			'icon-deviantart-2' : '&#xe106;',
			'icon-github' : '&#xe107;',
			'icon-github-2' : '&#xe108;',
			'icon-github-3' : '&#xe109;',
			'icon-github-4' : '&#xe10a;',
			'icon-github-5' : '&#xe10b;',
			'icon-github-6' : '&#xe10c;',
			'icon-git' : '&#xe10d;',
			'icon-github-7' : '&#xe10e;',
			'icon-wordpress' : '&#xe10f;',
			'icon-wordpress-2' : '&#xe110;',
			'icon-blogger' : '&#xe111;',
			'icon-blogger-2' : '&#xe112;',
			'icon-tumblr' : '&#xe113;',
			'icon-tumblr-2' : '&#xe114;',
			'icon-yahoo' : '&#xe115;',
			'icon-yahoo-2' : '&#xe116;',
			'icon-amazon' : '&#xe117;',
			'icon-amazon-2' : '&#xe118;',
			'icon-apple' : '&#xe119;',
			'icon-finder' : '&#xe11a;',
			'icon-android' : '&#xe11b;',
			'icon-windows' : '&#xe11c;',
			'icon-soundcloud' : '&#xe11d;',
			'icon-soundcloud-2' : '&#xe11e;',
			'icon-skype' : '&#xe11f;',
			'icon-reddit' : '&#xe120;',
			'icon-linkedin' : '&#xe121;',
			'icon-lastfm' : '&#xe122;',
			'icon-lastfm-2' : '&#xe123;',
			'icon-delicious' : '&#xe124;',
			'icon-stumbleupon' : '&#xe125;',
			'icon-stumbleupon-2' : '&#xe126;',
			'icon-pinterest' : '&#xe127;',
			'icon-pinterest-2' : '&#xe128;',
			'icon-xing' : '&#xe129;',
			'icon-libreoffice' : '&#xe12a;',
			'icon-file-pdf' : '&#xe12b;',
			'icon-file-openoffice' : '&#xe12c;',
			'icon-file-word' : '&#xe12d;',
			'icon-file-excel' : '&#xe12e;',
			'icon-file-powerpoint' : '&#xe12f;',
			'icon-file-zip' : '&#xe130;',
			'icon-file-xml' : '&#xe131;',
			'icon-file-css' : '&#xe132;',
			'icon-html5' : '&#xe133;',
			'icon-html5-2' : '&#xe134;',
			'icon-css3' : '&#xe135;',
			'icon-chrome' : '&#xe136;',
			'icon-firefox' : '&#xe137;',
			'icon-IE' : '&#xe138;',
			'icon-opera' : '&#xe139;',
			'icon-safari' : '&#xe13a;',
			'icon-IcoMoon' : '&#xe13b;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^s'"]+/);
		if (c) {
			addIcon(el, icons[c[0]]);
		}
	}
};