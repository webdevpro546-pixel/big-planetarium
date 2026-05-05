// JavaScript for BigPlanetarium
// handles the mobile nav, accordion and planet modal

// I wait for the page to fully load before running anything
document.addEventListener('DOMContentLoaded', function() {

    // ---- MOBILE NAV TOGGLE ----
    // shows and hides the nav on small screens

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('nav-open');

            // update aria-expanded so screen readers know the state
            if (navLinks.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-expanded', 'true');
            } else {
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    // close the nav if user clicks somewhere else
    document.addEventListener('click', function(e) {
        if (navToggle && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });


    // ---- ACCORDION ----
    // used on the about page for the FAQ section
    const accBtns = document.querySelectorAll('.acc-btn');

    accBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const panelId = btn.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // close all panels first
            accBtns.forEach(function(otherBtn) {
                const otherId = otherBtn.getAttribute('aria-controls');
                const otherPanel = document.getElementById(otherId);
                otherBtn.setAttribute('aria-expanded', 'false');
                if (otherPanel) otherPanel.classList.remove('open');
            });

            // then open this one if it was closed
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                panel.classList.add('open');
            }
        });
    });


    // ---- PLANET MODAL ----
    // opens when you click a planet card
    // I store all the planet info in an object here

    const planets = {
        mercury: {
            name: 'Mercury',
            type: 'Rocky Planet: 1st from the Sun',
            info: '<p>Mercury is the smallest planet in the Solar System and sits closest to the Sun. You might expect it to be the hottest, but that title belongs to Venus.</p><p>Because Mercury has almost no atmosphere, it cannot hold on to heat. This means temperatures can reach around 430°C during the day, but plummet to -180°C at night. No other planet has such extreme swings.</p><p>A day on Mercury lasts about 59 Earth days, while a full year only takes 88 days. This means Mercury\'s days and years overlap in a very unusual way.</p>'
        },
        venus: {
            name: 'Venus',
            type: 'Rocky Planet: 2nd from the Sun',
            info: '<p>Venus is sometimes called Earth\'s twin because the two planets are so similar in size. However, the similarities stop there. Venus has a dense atmosphere packed with carbon dioxide, which creates an extreme greenhouse effect.</p><p>The surface temperature averages around 465°C — hot enough to melt lead. The atmospheric pressure is 92 times stronger than on Earth.</p><p>Venus also rotates in the opposite direction to most planets, so on Venus the Sun would rise in the west and set in the east.</p>'
        },
        earth: {
            name: 'Earth',
            type: 'Rocky Planet: 3rd from the Sun',
            info: '<p>Earth is the only planet we know of that supports life. It has liquid water on its surface, a breathable atmosphere made mostly of nitrogen and oxygen, and a magnetic field that protects us from harmful radiation from the Sun.</p><p>About 71% of Earth\'s surface is covered by water. Our distance from the Sun places us in what scientists call the "habitable zone" — not too hot and not too cold.</p><p>Earth has one Moon, which helps stabilise the planet\'s tilt and keeps our climate relatively stable over long periods of time.</p>'
        },
        mars: {
            name: 'Mars',
            type: 'Rocky Planet: 4th from the Sun',
            info: '<p>Mars is known as the Red Planet because its surface is covered in iron oxide — essentially rust. It is a cold, dry desert world with a thin atmosphere of carbon dioxide.</p><p>Mars is home to Olympus Mons, the largest volcano in the Solar System. It stands nearly three times the height of Mount Everest. Mars also has a canyon system called Valles Marineris which is around 4,000 km long.</p><p>Today, several rovers including NASA\'s Perseverance are exploring the surface of Mars, looking for signs of ancient microbial life.</p>'
        },
        jupiter: {
            name: 'Jupiter',
            type: 'Gas Giant: 5th from the Sun',
            info: '<p>Jupiter is by far the largest planet in our Solar System. More than 1,300 Earths could fit inside it. It is a gas giant, meaning it has no solid surface — it is made mostly of hydrogen and helium.</p><p>The most recognisable feature of Jupiter is its Great Red Spot, which is actually a massive storm that has been raging for hundreds of years. It is larger than the entire planet Earth.</p><p>Jupiter has at least 95 known moons. One of them, Europa, has a vast ocean beneath its icy surface, making it one of the most exciting places in the search for life beyond Earth.</p>'
        },
        saturn: {
            name: 'Saturn',
            type: 'Gas Giant: 6th from the Sun',
            info: '<p>Saturn is instantly recognisable thanks to its spectacular ring system. The rings are made up of billions of pieces of ice and rock, ranging in size from tiny grains to chunks as large as a house. The rings stretch out up to 282,000 km from the planet but are often only around 10 metres thick.</p><p>Saturn is the least dense planet in the Solar System — so low in density that it would theoretically float on water. It spins very fast, completing one rotation in just under 11 hours.</p><p>Saturn has 146 confirmed moons. Its largest moon, Titan, has a thick atmosphere and lakes of liquid methane on its surface.</p>'
        },
        uranus: {
            name: 'Uranus',
            type: 'Ice Giant: 7th from the Sun',
            info: '<p>Uranus is an ice giant. Unlike Jupiter and Saturn, its interior is made up of a slushy mixture of water, methane and ammonia ices. Methane in its atmosphere gives Uranus its distinctive blue-green colour.</p><p>The most unusual thing about Uranus is that it rotates on its side. Its axis is tilted at about 98 degrees, meaning its poles point almost directly at the Sun. This gives it extremely long and unusual seasons.</p><p>Uranus was discovered by William Herschel in 1781 using a telescope, making it the first planet to be discovered in recorded history rather than known from ancient times.</p>'
        },
        neptune: {
            name: 'Neptune',
            type: 'Ice Giant: 8th from the Sun',
            info: '<p>Neptune is the furthest planet from the Sun in our Solar System. It takes 165 Earth years to complete just one orbit. Despite being so far from the Sun, Neptune has the strongest winds of any planet, with gusts reaching up to 2,100 km/h.</p><p>Neptune has a large dark storm system called the Great Dark Spot, similar to Jupiter\'s Great Red Spot, though it comes and goes over the years.</p><p>Its largest moon, Triton, orbits in the opposite direction to Neptune\'s rotation, which suggests it was captured from the Kuiper Belt rather than forming alongside the planet.</p>'
        }
    };

    const modalBg = document.getElementById('planet-modal');
    const modalTitle = document.getElementById('modal-planet-name');
    const modalType = document.getElementById('modal-planet-type');
    const modalInfo = document.getElementById('modal-planet-info');
    const closeBtn = document.getElementById('close-modal');

    // keeps track of which card was clicked so I can return focus later
    let lastCard = null;

    // open the modal when a planet card is clicked
    const planetCards = document.querySelectorAll('.planet-card');

    planetCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const key = card.getAttribute('data-planet');
            openModal(key, card);
        });

        // allow keyboard users to open the modal with Enter or Space
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const key = card.getAttribute('data-planet');
                openModal(key, card);
            }
        });
    });

    function openModal(key, triggerCard) {
        const data = planets[key];
        if (!data) return;

        modalTitle.textContent = data.name;
        modalType.textContent = data.type;
        modalInfo.innerHTML = data.info;

        modalBg.classList.add('open');
        document.body.style.overflow = 'hidden'; // stop page scrolling behind modal
        lastCard = triggerCard;

        // move focus to close button
        closeBtn.focus();
    }

    function closeModal() {
        modalBg.classList.remove('open');
        document.body.style.overflow = '';

        // send focus back to the card that was clicked
        if (lastCard) {
            lastCard.focus();
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // close if user clicks the dark background
    if (modalBg) {
        modalBg.addEventListener('click', function(e) {
            if (e.target === modalBg) {
                closeModal();
            }
        });
    }

    // close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalBg && modalBg.classList.contains('open')) {
            closeModal();
        }
    });

});