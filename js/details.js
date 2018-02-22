$(document).ready(function () {
    let $sala = $('#sala');
    $('use').on('click', function () {
        if ($(this).hasClass('noSelected'))
            $(this).removeClass('noSelected').addClass('selected');
        else
            $(this).removeClass('selected').addClass('noSelected');
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

    var s = function(sel) {
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
            // moveAround(position);
        }
    ).on('pressure', function (evt, data) {
        position = data;
        // moveAround(position);

    });

    function moveAround(data) {
        let prevVB = $sala.attr('viewBox').split(' ');
        let valueX = 0;
        let valueY = 0;
        if (data.direction !== undefined) {
            if (data.direction.x === 'right') {
                valueX = -10;
            } else {
                valueX = 10;
            }
            if (data.direction.y === 'up') {
                valueY = 10;
            } else {
                valueY = -10;
            }
        }


        prevVB[0] = parseInt(prevVB[0]) + valueX;
        prevVB[1] = parseInt(prevVB[1]) + valueY;
        $sala.attr('viewBox', `${prevVB[0]} ${prevVB[1]} ${prevVB[2]} ${prevVB[3]}`);
    }
});
// var deltaX = 0;
// var deltaY = 0;
// var scale = 1.0;

// var drag = {
//   elem: null,
//   x: 0,
//   y: 0,
//   state: false
// };
// var delta = {
//   x: 0,
//   y: 0
// };
// var currentX = 0,
//   currentY = 0;
// var currentdx = 201.70001220703125,
//   currentdy = 36.69999694824219;
// var previousdx = 0,
//   previousdy = 0;

// $('.zoom_panel').mousedown(function(e) {
//   if (!drag.state && e.which == 1) {
//     drag.elem = $('#sala');
//     drag.state = true;
//     currentX = e.offsetX;
//     currentY = e.offsetY;
//   }
//   return false;
// });


// $('.zoom_panel').mousemove(function(e) {
//   if (drag.state) {
//     var attrs = $(drag.elem).attr('viewBox').split(' ');
//     dx = e.offsetX - currentX + currentdx;
//     dy = e.offsetY - currentY + currentdy;
//     newMatrix = `${dx/2} ${dy/2} ${attrs[2]} ${attrs[3]}`;// 'viewBox(' + (dx) + ',' + (dy) + ') ' +  + ;
//     previousdx = dx;
//     previousdy = dy;
//     $(drag.elem).attr('viewBox', newMatrix);

//   }
// });
// $('.zoom_panel').mouseup(function() {
//   if (drag.state) {
//     drag.state = false;
//     currentdx = previousdx;
//     currentdy = previousdy;
//   }
// });

// $('.zoom_panel').on('contextmenu', function() {
//   return false;
// });
// $('.zoom_panel').addClass('active');

// var use = document.getElementsByClassName('butaca');
// for (let i = 0; i < use.length; i++) {
//     use[i].addEventListener('click', () => {
//         if (this.getAttribute('class') === 'noSelected')
//             alert(this);
//     }, false);

// }
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
// var filmCatalog = JSON.parse(localStorage.getItem('rating'));


// var $film = $(this).prev().attr('id');
// var $film = $(this).attr('id');

// var $movieDetails = $('#movieDetails');
// var tmpFilm;
// var url;
// filmCatalog.find(o => {
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
//         filmCatalog.find(o => {
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
//         localStorage.setItem('rating', JSON.stringify(filmCatalog));
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