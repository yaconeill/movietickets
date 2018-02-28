$(document).ready(function () {
    User = function (id, name, email, tickets, costs, seats, selectedFilmId, filmTitle) {
        this.id = id;
        this.name = name;
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
    var userList = loadData();
    var $section = $('#section');
    // loadData();
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
    let unAvailable = [];

    movieList.find(o => {
        if (o.id === selectedFilm.id) {
            tmpFilm = o;
            title = o.title;
            for (let i = 0; i < o.sold[selectedFilm.dayWeek].length; i++)
                if (o.sold[selectedFilm.dayWeek][i].day === selectedFilm.day &&
                    o.sold[selectedFilm.dayWeek][i].hour === selectedFilm.hour)
                    unAvailable.push(o.sold[selectedFilm.dayWeek][i].seats);
        }
    });

    /**
     * Check seats unavailable
     */
    $('#sala use').each(function (idx, e) {
        let row = parseInt($(this).parent().attr('id').split('w').slice(-1)[0]);
        let seat = $(this).data('butaca');
        for (let i = 0; i < unAvailable.length; i++)
            for (let j = 0; j < unAvailable[i].length; j++)
                if (unAvailable[i][j].row === row && unAvailable[i][j].seat === seat)
                    $(this).removeClass('noSelected').addClass('unavailable');
    });

    // localStorage.removeItem('userListTmp');
    var newUser = new User(uuidv4(), 'tempUser', '', 0, 0, '', selectedFilm, title);
    userList.push(newUser);
    localStorage.setItem('currentUser', newUser.id);
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
        let span = $(this).closest('div').find('.amount');
        let value = parseInt(span.text());
        let type = $(this).closest('div').attr('class').split(' ').slice(-1);
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
        let t = 0;
        $('.amount').each(function () {
            return t += parseInt($(this).text());
        });
        if (t > 0)
            $nextBtn.fadeIn().show();
        else
            $nextBtn.fadeOut().hide('slow');
        $('.subtotal p').each(function () {
            total += parseFloat($(this).text());
        });
        $totalPrice.text(roundPrice(total));
        newUser.costs = total;
    });

    function roundPrice(value) {
        return Math.round((value + 0.00001) * 100) / 100;
    }

    var $nextBtn = $('#next');
    $nextBtn.hide();
    $nextBtn.on('click', function () {
        $('#sala use').each(function (idx, e) {
            if ($(this).hasClass('selected'))
                $(this).removeClass('selected').addClass('noSelected');
        });
        let tickets = 0;
        $('.amount').each(function () {
            tickets += parseInt($(this).text());
        });
        if (tickets > 10) {
            erroMsg('Por favor seleccione como máximo 10 lugares.', '.error');
        } else if (tickets === 0) {
            erroMsg('Por favor seleccione al menos 1.', '.error');
        } else {
            userList.find(e => {
                if (e.id === localStorage.getItem('currentUser')) {
                    e.tickets = tickets;
                }
            });
            $('.alert').alert('close');
            $('a[href="#chooseSeat"]').removeClass('disabled').tab('show').addClass('disabled');
        }
    });
    function erroMsg(text, node) {
        let $error = $(node);
        $error.children().remove();
        $error.append(`<div class="alert alert-danger" role="alert">
                            ${text}
                        </div>`);
    }

    //#endregion


    //#region - sala svg
    let $sala = $('#sala');

    var Window = $(window);
    if (Window[0].innerWidth < 768)
        $sala.attr('height', '190');
    else if (Window[0].innerWidth < 992)
        $sala.attr('height', '300');
    else if (Window[0].innerWidth < 1200)
        $sala.attr('height', '400');
    else
        $sala.attr('height', '500');

    Window.resize(function () {
        if (Window[0].innerWidth < 768)
            $sala.attr('height', '190');
        else if (Window[0].innerWidth < 992)
            $sala.attr('height', '300');
        else if (Window[0].innerWidth < 1200)
            $sala.attr('height', '400');
        else
            $sala.attr('height', '500');
    });

    $sala.find('use').on('click', function () {
        let numTickets = userList.find(e => e.id === localStorage.getItem('currentUser')).tickets;
        let numSelected = numSeatsSelected();

        if ($(this).hasClass('noSelected')) {
            if (numSelected < numTickets)
                $(this).removeClass('noSelected').addClass('selected');
        } else if ($(this).hasClass('selected'))
            $(this).removeClass('selected').addClass('noSelected');
    });

    function numSeatsSelected() {
        let numSelected = 0;
        $('#sala use').each(function (idx, e) {
            if ($(this).hasClass('selected'))
                numSelected++;
        });
        return numSelected;
    }

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
        editViewBox(value, 'zoom')
    });

    let $btnMoveXY = $('.btnMoveXY');
    $btnMoveXY.click(function () {
        switch ($(this).data('zoom')) {
            case 'up':
                editViewBox(40, 'move', 'Y')
                break;
            case 'down':
                editViewBox(-40, 'move', 'Y')
                break;
            case 'right':
                editViewBox(40, 'move', 'X')
                break;
            case 'left':
                editViewBox(-40, 'move', 'X')
                break;
        }
    });

    function editViewBox(value, mode, direction) {
        let prevVB = $sala.attr('viewBox').split(' ');
        if (mode === 'zoom')
            prevVB[3] = parseInt(value);
        else {
            if (direction === 'Y')
                prevVB[1] = parseInt(prevVB[1]) + value;
            else
                prevVB[0] = parseInt(prevVB[0]) + value;
        }

        $sala.attr('viewBox', `${prevVB[0]} ${prevVB[1]} ${prevVB[2]} ${prevVB[3]}`);
    }

    //#endregion

    $('#goPay').click(function () {
        let seatSelection = [];
        let numTickets = userList.find(e => e.id === localStorage.getItem('currentUser')).tickets;
        let numSelected = numSeatsSelected();
        if (numSelected === numTickets) {
            $('#sala use').each(function (idx, e) {
                if ($(this).hasClass('selected')) {
                    let seat = $(this).data('butaca');
                    let row = parseInt($(this).parent().attr('id').split('w').slice(-1)[0]);
                    seatSelection.push({ 'seat': seat, 'row': row });
                }
            });
            userList.find(e => {
                if (e.id === localStorage.getItem('currentUser')) {
                    e.seats = seatSelection;
                }
            });
            $('a[href="#payment"]').removeClass('disabled').tab('show').addClass('disabled');
        } else {
            if (numSelected === 0)
                erroMsg('No has seleccionado ninguna butaca', '.errorSeat');
            else {
                let num = numTickets - numSelected;
                num > 1 ? num += ' butacas' : num += ' butaca'
                erroMsg(`Te falta seleccionar ${num}`, '.errorSeat');
            }
        }
    });

    $('form').submit(function (e) {
        e.preventDefault();
        let text;
        let form = $('#datos_pago').find('input');
        let $showInfo = $('.data');
        let movieList = JSON.parse(localStorage.getItem('movieList'));
        userList.find(u => {
            if (u.id === localStorage.getItem('currentUser')) {
                u.email = form[0].value;
                u.name = form[1].value;
                movieList.find(m => {
                    if (m.id === u.selectedFilmId.id) {
                        m.sold[u.selectedFilmId.dayWeek].push({ 'day': u.selectedFilmId.day, 'hour': u.selectedFilmId.hour, 'seats': u.seats });
                        text = `ID: ${uuidv4()} - ${u.selectedFilmId.dayWeek} ${u.selectedFilmId.day}, ${u.selectedFilmId.hour} `;
                        for (let i = 0; i < u.seats.length; i++) {
                            text += ' || Fila: ' + u.seats[i].row;
                            text += ' Asiento: ' + u.seats[i].seat;
                            $showInfo.eq(3).find('.butacas').append(`<p>Fila: ${u.seats[i].row} Asiento: ${u.seats[i].seat}</p>`);
                        }
                        $showInfo.eq(2).find('p').text(m.title);
                    }
                });
                localStorage.setItem('movieList', JSON.stringify(movieList));
                $showInfo.eq(0).find('p').text(`${u.selectedFilmId.dayWeek} ${u.selectedFilmId.day}`);
                $showInfo.eq(1).find('p').text(u.selectedFilmId.hour);
                $('.payed').text(u.costs + ' €');
            }
        });
        localStorage.setItem('userList', JSON.stringify(userList));
        // localStorage.removeItem('userListTmp');
        new QRCode(document.getElementById("qrcode"), {
            text: text,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        $('a[href="#confirm"]').removeClass('disabled').tab('show').addClass('disabled');
    });

    $('#goBackTickets').click(function () {
        $('a[href="#tickets"]').removeClass('disabled').tab('show').addClass('disabled');
    });
    $('#goBackSeats').click(function () {
        $('a[href="#chooseSeat"]').removeClass('disabled').tab('show').addClass('disabled');
    });

    // var s = function (sel) {
    //     return document.querySelector(sel);
    // };

    // var radius = 100;
    // var sampleJoystick = {
    //     zone: s('#zone_joystick'),
    //     mode: 'static',
    //     position: {
    //         left: '112%',
    //         top: '90%'
    //     },
    //     color: 'black'
    // };

    // var joystick;
    // var position;
    // joystick = nipplejs.create(sampleJoystick);
    // joystick.on('start end', function (evt, data) {
    //     position = data;
    // }).on('move', function (evt, data) {
    //     position = data;
    //     moveAround(position);
    // }).on('dir:up plain:up dir:left plain:left dir:down' +
    //     'plain:down dir:right plain:right',
    //     function (evt, data) {
    //         position = data;
    //     }
    // ).on('pressure', function (evt, data) {
    //     position = data;

    // });

    // function moveAround(data) {
    //     let prevVB = $sala.attr('viewBox').split(' ');
    //     let valueX = 0;
    //     let valueY = 0;
    //     if (data.direction !== undefined) {
    //         if (data.direction.x === 'right') {
    //             valueX = +10;
    //         } else {
    //             valueX = 10;
    //         }
    //         if (data.direction.y === 'up') {
    //             valueY = 10;
    //         } else {
    //             valueY = +10;
    //         }
    //     }
    //     prevVB[0] = parseInt(prevVB[0]) + valueX;
    //     prevVB[1] = parseInt(prevVB[1]) + valueY;
    //     $sala.attr('viewBox', `${prevVB[0]} ${prevVB[1]} ${prevVB[2]} ${prevVB[3]}`);
    // }



    // init();
    // function init() {
    //     var sala = document.getElementById("sala");
    //     if (sala) {
    // sala.addEventListener("mousedown", mouseDown, false);
    // sala.addEventListener("mouseup", mouseUp, false);
    //     }
    // }

    // // function mouseDown(evt) {
    //     sala.addEventListener("mousemove", mouseMove, false);
    // // }

    // function mouseUp(evt) {
    //     var mousex = evt.clientX;
    //     var mousey = evt.clientY;
    //     console.log(mousex,mousey);
    // }

    // function mouseMove(evt) {
    //     sala.addEventListener("mousedown", (data) => {
    //         moveAround(data, evt);
    //     }, false);
    // }

    // function moveAround(data, evt) {
    //     let prevVB = $sala.attr('viewBox').split(' ');
    //     let valueX = 0;
    //     let valueY = 0;
    //     // if (data.clientX !== undefined) {
    //         if (data.movementX > 0) {
    //             valueX = 5;
    //         } else {
    //             valueX = -5;
    //         }
    //         if (data.movementY > 0) {
    //             valueY = 5;
    //         } else {
    //             valueY = -5;
    //         }
    //     // }
    //     prevVB[0] = parseInt(prevVB[0]) + valueX;
    //     prevVB[1] = parseInt(prevVB[1]) + valueY;
    //     $sala.attr('viewBox', `${prevVB[0]} ${prevVB[1]} ${prevVB[2]} ${prevVB[3]}`);
    // }

















    //#endregion

    function loadData() {
        userList = JSON.parse(localStorage.getItem('userList'));
        if (userList == null)
            userList = [];
        return userList;
    }
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});