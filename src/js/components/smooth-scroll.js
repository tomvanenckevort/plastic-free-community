import smoothscroll from 'smoothscroll-polyfill';

function SmoothScroll($module) {
    this.$module = $module || document;
}

SmoothScroll.prototype.scrollToElement = function(targetId) {
    // smooth scroll to target and update hash in URL
    this.$module.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    history.pushState(null, null, targetId);
};

SmoothScroll.prototype.init = function() {
    // initialise polyfill for unsupported browsers
    smoothscroll.polyfill();
};

export default SmoothScroll;
