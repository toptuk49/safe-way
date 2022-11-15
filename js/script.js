function init() {
    function testWebP(callback) {

        var webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {

        if (support == true) {
            document.querySelector('body').classList.add('webp');
        } else {
            document.querySelector('body').classList.add('no-webp');
        }
    });

    let search_input = document.querySelector('.search-container__input');
    let dropdown = document.querySelector('.search-container__dropdown');

    document.addEventListener('click', function (e) {
        if (e.target == search_input) {
            dropdown.style.display = "block";
        } else {
            dropdown.style.display = "none";
        }
    });

    let point49 = [51.30770390, 37.88526904],
        point28 = [51.31329631, 37.89193673],
        point11 = [51.31124501, 37.88767123],
        school = [51.30819533, 37.87967864],
        routeFrom49 = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                point49,
                [51.31086383, 37.88036630],
                school
            ],
            params: {
                routingMode: 'pedestrian',
                viaPoints: [1]
            }
        }, {
            boundsAutoApply: true
        }),
        routeFrom28 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            point28,
            [51.31059486, 37.87972794],
            school
        ],
        params: {
            routingMode: 'pedestrian',
            viaPoints: [1]
        }
    }, {
        boundsAutoApply: true
    }),
        routeFrom11 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            point11,
            [51.31059486, 37.87972794],
            school
        ],
        params: {
            routingMode: 'pedestrian',
            viaPoints: [1]
        }
    }, {
        boundsAutoApply: true
    });

    let changePointsButton = new ymaps.control.Button({
        data: {
            content: "Поменять местами точки А и В"
        },
        options: {
            selectOnClick: true
        }
    });

    changePointsButton.events.add('select', function () {
        routeFrom49.model.setReferencePoints([school, point49]);
    });

    changePointsButton.events.add('deselect', function () {
        routeFrom49.model.setReferencePoints([point49, school]);
    });
    changePointsButton.events.add('select', function () {
        routeFrom28.model.setReferencePoints([school, point28]);
    });

    changePointsButton.events.add('deselect', function () {
        routeFrom28.model.setReferencePoints([point28, school]);
    });
    changePointsButton.events.add('select', function () {
        routeFrom11.model.setReferencePoints([school, point11]);
    });

    changePointsButton.events.add('deselect', function () {
        routeFrom11.model.setReferencePoints([point11, school]);
    });

    let empty = new ymaps.Map(document.getElementsByClassName('map')[0], {
        center: [51.30819533, 37.87967864],
        zoom: 18,
        controls: [changePointsButton]
    }, {
        buttonMaxWidth: 300
    });
    let map49 = new ymaps.Map(document.getElementsByClassName('map')[1], {
        center: [51.30813989, 37.88237635],
        zoom: 17,
        controls: [changePointsButton]
    }, {
        buttonMaxWidth: 300
    });
    let map28 = new ymaps.Map(document.getElementsByClassName('map')[2], {
        center: [51.31059156, 37.88570188],
        zoom: 15,
        controls: [changePointsButton]
    }, {
        buttonMaxWidth: 300
    });
    let map11 = new ymaps.Map(document.getElementsByClassName('map')[3], {
        center: [51.30985189, 37.88445734],
        zoom: 16,
        controls: [changePointsButton]
    }, {
        buttonMaxWidth: 300
    });

    map49.geoObjects.add(routeFrom49);
    map28.geoObjects.add(routeFrom28);
    map11.geoObjects.add(routeFrom11);

    let y_maps = [empty, map49, map28, map11]

    let geolocation = ymaps.geolocation;

    for (let i = 0; i < y_maps.length; i++) {
        geolocation.get({
            provider: 'yandex',
            mapStateAutoApply: true
        }).then(function (result) {
            result.geoObjects.options.set('preset', 'islands#redCircleIcon');
            result.geoObjects.get(0).properties.set({
                balloonContentBody: 'Мое местоположение'
            });
            y_maps[i].geoObjects.add(result.geoObjects);
        });

        geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
            y_maps[i].geoObjects.add(result.geoObjects);
        });
    }

    let maps = document.querySelectorAll('.map');

    let buttons = document.querySelectorAll('.search-container__dropdown__item');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            for (let a = 0; a < maps.length; a++) {
                maps[a].style.display = "none";
            }

            maps[i].style.display = "block";
        });
    }
}

ymaps.ready(init);