const btWrapper = document.querySelector('.bt-wrapper');
const btCarousel = document.querySelector('.bt-carousel');
const btCards = document.querySelectorAll('.bt-card');
const btSlideLeftBtn = document.querySelector('.bt-slide-left');
const btSlideRightBtn = document.querySelector('.bt-slide-right');

const mWrapper = document.querySelector('.m-wrapper');
const mCarousel = document.querySelector('.m-carousel');
const mCards = document.querySelectorAll('.m-card');
const mSlideLeftBtn = document.querySelector('.m-slide-left');
const mSlideRightBtn = document.querySelector('.m-slide-right');

let currentWidthIndex = window.innerWidth;

let btImgFullWidth = 0;
let btOffset = 0;
let btMaxOffset = 0;

let mImgFullWidth = 0;
let mOffset = 0;
let mMaxOffset = 0;

const CarouselManipulation = () => {
	btImgFullWidth = btCards[0].offsetWidth + 20;
	btCarousel.style.width = `${btImgFullWidth * btCards.length}px`;
	btMaxOffset = btCarousel.offsetWidth - btWrapper.offsetWidth;

	mImgFullWidth = mCards[0].offsetWidth + 20;
	mCarousel.style.width = `${mImgFullWidth * mCards.length}px`;
	mMaxOffset = mCarousel.offsetWidth - mWrapper.offsetWidth;
};

window.onload = () => {
	CarouselManipulation();
};

window.onresize = () => {
	if (currentWidthIndex !== window.innerWidth) {
		document.location.reload();
    currentWidthIndex = window.innerWidth;
  }
};

btSlideLeftBtn.onclick = () => {
	if (btOffset !== 0) {
		btOffset += btImgFullWidth;
		btCarousel.style.transform = `translateX(${btOffset}px)`;
	}
};

btSlideRightBtn.onclick = () => {
	if (Math.abs(btOffset) < btMaxOffset) {
		btOffset -= btImgFullWidth;
		btCarousel.style.transform = `translateX(${btOffset}px)`;
	}
};

mSlideLeftBtn.onclick = () => {
	if (mOffset !== 0) {
		mOffset += mImgFullWidth;
		mCarousel.style.transform = `translateX(${mOffset}px)`;
	}
};

mSlideRightBtn.onclick = () => {
	if (Math.abs(mOffset) < mMaxOffset) {
		mOffset -= mImgFullWidth;
		mCarousel.style.transform = `translateX(${mOffset}px)`;
	}
};
