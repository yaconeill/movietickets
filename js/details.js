$(document).ready(function () {
    User = function (name, phone, email, tickets, costs, seats, selectedFilmId, filmTitle) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.tickets = tickets;
        this.costs = costs;
        this.seats = seats;
        this.selectedFilmId = selectedFilmId;
        this.filmTitle = filmTitle;
    }
    var Prices = {
        'adult': 8.2,
        'young': 6.7,
        'child': 6.2,
        'senior': 6.7
    };
    // isLogin();
    // var userName = localStorage.getItem('currentUser');
    var $section = $('#section');
    // isNewUser(userName, $section);
    var userList = JSON.parse(localStorage.getItem('userList'));
    if (userList == null)
        userList = [];
    var selectedFilm = JSON.parse(localStorage.getItem('selectedFilm'));
    var movieList = JSON.parse(localStorage.getItem('movieList'));
    var seatSelection = $('.zoom_panel');
    seatSelection.hide();
    var $totalPrice = $('.price');
    var $film = $(this).prev().attr('id');
    var $film = $(this).attr('id');

    var $moviePoster = $('#moviePoster');
    var tmpFilm;
    var title;
    movieList.find(o => {
        if (o.id === selectedFilm.id) {
            tmpFilm = o;
            title = o.title;
        }
    });

    var newUser = new User('tempUser', '', '', 0, 0, '', selectedFilm, title);
    
    $('.jumbotron').css('opacity', '0.9');
    $moviePoster.children().remove();
    $moviePoster.append($('<div class="film">'));
    $('.title').text(tmpFilm.name);
    $moviePoster.children('div').append(
        $(`<img src="../${tmpFilm.poster}" title="${tmpFilm.title}" 
        alt="${tmpFilm.title}" id="${tmpFilm.id}"/>`));
    $('.details').append(`
    <h2>Detalles</h2>    
    <div class="row">
        <div class="col-sm-5">
            <p>Película</p>
            <p>Fecha</p>
            <p>Función</p>
        </div>
        <div class="col-sm-7">
            <p>${tmpFilm.title}</p>
            <p>${selectedFilm.dayWeek} ${selectedFilm.day}</p>
            <p>${selectedFilm.hour}</p>
        </div>
    </div>`);

    //#region - select tickets
    var $ticketSelection = $('.entradas');
    let $buttons = $ticketSelection.find('button');
    $buttons.on('click', function () {
        let total = 0;
        let subTotal;
        let span = $(this).closest('div').find('span');
        let value = parseInt(span.text());
        let type = $(this).closest('div').attr('class').split(' ')[1];
        let price = Prices[type];
        if ($(this).data('action') === 'plus') {
            value++;
            if (value <= 10) {
                span.text(value);
                subTotal = roundPrice((price * value));
                $(this).closest('.row').find('p').last().text(subTotal);
            }
        } else {
            value--;
            if (value >= 0) {
                span.text(value);
                subTotal = roundPrice((price * value));
                $(this).closest('.row').find('p').last().text(subTotal);
            }
        }
        $('.subtotal p').each(function () {
            total += parseFloat($(this).text());
        });
        $totalPrice.text(roundPrice(total));
        newUser.costs = total;
    });

    function roundPrice(value) {

        return Math.round((value + 0.00001) * 100) / 100;
    }

    $('#next').on('click', function(){
        let tickets = 0;
        $('.amount').each(function () {
            tickets += parseInt($(this).text());
        });
        if (tickets > 10){
            $('.error').append(`
            <div class="alert alert-danger" role="alert">
                Por favor seleccione como máximo 10 lugares.
            </div>
            `);
        }else{
            newUser.tickets = tickets;
            userList.push(newUser);
            localStorage.setItem('userList', JSON.stringify(userList));
            $('.alert').alert('close');
            $('a[href="#chooseSeat"]').removeClass('disabled').tab('show').addClass('disabled');
        }
    });

    //#endregion

    //#region - sala svg
    let $sala = $('#sala');
    $sala.find('use').on('click', () => {
        if ($(this).hasClass('noSelected'))
            $(this).removeClass('noSelected').addClass('selected');
        else
            $(this).removeClass('selected').addClass('noSelected');
    });

    $('g use').hover(function () {
        $(this).css('cursor', 'pointer').attr('title', 'This is a hover text.');
    }, function () {
        $(this).css('cursor', 'auto');
    });

    $('#resetSala').click(() => {
        $sala.attr('viewBox', '550 -80 2000 2600');
        $zoom.val('2600');
    });

    let $zoom = $('#zoom');
    $zoom.change(() => {
        let value = $zoom.val();
        let prevVB = $sala.attr('viewBox').split(' ');
        prevVB[3] = parseInt(value);
        $sala.attr('viewBox', `${prevVB[0]} ${prevVB[1]} ${prevVB[2]} ${prevVB[3]}`);
    });

    var s = function (sel) {
        return document.querySelector(sel);
    };

    var radius = 100;
    var sampleJoystick = {
        zone: s('#zone_joystick'),
        mode: 'static',
        position: {
            left: '112%',
            top: '90%'
        },
        color: 'black'
    };

    var joystick;
    var position;
    joystick = nipplejs.create(sampleJoystick);
    joystick.on('start end', function (evt, data) {
        position = data;
    }).on('move', function (evt, data) {
        position = data;
        moveAround(position);
    }).on('dir:up plain:up dir:left plain:left dir:down' +
        'plain:down dir:right plain:right',
        function (evt, data) {
            position = data;
        }
    ).on('pressure', function (evt, data) {
        position = data;

    });

    function moveAround(data) {
        let prevVB = $sala.attr('viewBox').split(' ');
        let valueX = 0;
        let valueY = 0;
        if (data.direction !== undefined) {
            if (data.direction.x === 'right') {
                valueX = 10;
            } else {
                valueX = -10;
            }
            if (data.direction.y === 'up') {
                valueY = -10;
            } else {
                valueY = 10;
            }
        }
        prevVB[0] = parseInt(prevVB[0]) + valueX;
        prevVB[1] = parseInt(prevVB[1]) + valueY;
        $sala.attr('viewBox', `${prevVB[0]} ${prevVB[1]} ${prevVB[2]} ${prevVB[3]}`);
    }
    //#endregion
});

// User = function (name, phone, email, selectedFilmId) {
//     this.name = name;
//     this.phone = phone;
//     this.email = email;
//     this.selectedFilmId = selectedFilmId;
// }
// isLogin();
// var userName = localStorage.getItem('currentUser');
// var $section = $('#section');
// isNewUser(userName, $section);
// var userList = JSON.parse(localStorage.getItem('userList'));
// if (userList == null)
//     userList = [];

// var selectedFilm = localStorage.getItem('selectedFilm');
// var movieList = JSON.parse(localStorage.getItem('rating'));


// var $film = $(this).prev().attr('id');
// var $film = $(this).attr('id');

// var $movieDetails = $('#movieDetails');
// var tmpFilm;
// var url;
// movieList.find(o => {
//     if (o.id === selectedFilm) {
//         tmpFilm = o;
//         // url = o.img;
//     }
// });
// bgImg.forEach(e => {
//     if (e.id == selectedFilm)
//         url = e.img;
// });
// $('body').css('background-image', `url(${url}`);
// $('body').css('background-repeat', 'no-repeat');
// // $('body').css('background-size', '100%');
// $('body').css('background-attachment', 'fixed');
// $('.jumbotron').css('opacity', '0.9')
// $movieDetails.children().remove();
// $movieDetails.append($('<div class="film">'));
// $('.title').text(tmpFilm.name);
// $movieDetails.children('div').append(
//     $(`<img src="../${tmpFilm.img}" title="${tmpFilm.name}" alt="${tmpFilm.name}" id="${tmpFilm.id}"/>`));
// $('.sinopsis').text(tmpFilm.description);

// var $form = $('#register');
// $form.submit(function () {
//     $userData = $form.find('input');
//     userName = $userData[0].value;
//     let user = new User($userData[0].value, $userData[1].value, $userData[2].value, '');
//     userList.push(user);
//     localStorage.setItem('userList', JSON.stringify(userList));
//     localStorage.setItem('currentUser', $userData[0].value);
//     isLogin();
//     $section.children().remove();
//     isNewUser(userName, $section);
//     location.reload();
// });

// $('#logout').click(function () {
//     localStorage.removeItem('currentUser');
//     location.reload();
// });

// $('#vote').click(function () {
//     if (userList.find(o => o.selectedFilm == null) != null) {
//         let filmClickId = $('img').attr('id');
//         let film;
//         movieList.find(o => {
//             if (o.id === filmClickId) {
//                 o.rate += 1;
//                 film = o.name;
//             }
//         });
//         userList.find(o => {
//             if (o.name === userName) {
//                 o.selectedFilm = filmClickId;
//             }
//         });
//         localStorage.setItem('rating', JSON.stringify(movieList));
//         localStorage.setItem('userList', JSON.stringify(userList));
//         alert('Ha votado por ' + film + '. Gracias por participar. Se autoredigirirá en 3 segundos.');
//         setTimeout(function () {
//             window.location.href = "../pages/results.html";
//         }, 3000);

//     } else {
//         alert('Solo se puede votar una vez');
//     }
// });
// });

// function isNewUser(userName, $section) {
//     if (userName != null) {
//         $section.children().remove();
//         $section.append($('<div class="col-md-1 mx-auto">'));
//         $section.children('div').append($(`<input type="button"
//         value="Votar" id="vote" aria-label="Al hacer click realizará su voto y se redigirirá automáticamente a los resultados. Solo se puede votar una vez" class="btn btn-success rate" autofocus/>`));
//     }
// }