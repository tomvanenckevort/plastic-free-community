import MobileNav from './components/mobile-navigation';
import Instafeed from 'instafeed.es6/lib/instafeed';

// Initialise mobile navigation
new MobileNav().init();

// Initialise Instagram feed
var $instafeed = document.querySelector('#instafeed');
if ($instafeed) {
    new Instafeed({
        get: 'user',
        userId: $instafeed.getAttribute('data-user-id'),
        accessToken: $instafeed.getAttribute('data-access-token'),
        resolution: 'standard_resolution',
        template:
            '<div class="govuk-grid-column-one-quarter social-feed__item"><a href="{{link}}" target="_blank" id="{{id}}"><div class="social-feed__image" title="{{caption}}" style="background-image: url(\'{{image}}\');"></div></a></div>',
        sortBy: 'most-recent',
        limit: 4,
        links: false
    }).run();
}
