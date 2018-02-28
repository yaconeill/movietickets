/**
 * Object to save the voting data that will be printed in chart
 * @param  {String} type - comics|characters
 * @param  {String} name - comic|character name
 * @param  {Int} id - id from the item
 * @param  {Int} rate - amount of votes
 */
$(document).ready(function () {
        RatingData = function (type, name, id, rate) {
            this.type = type
            this.name = name;
            this.id = id;
            this.rate = rate;
        };
        // #region - Register form
        /**
         * Object to save user data
         * @param  {String} name
         * @param  {String} phone
         * @param  {String} email
         * @param  {Integer} selectedComicId
         * @param  {Integer} selectedCharacterId
         */
        User = function (name, phone, email, selectedComicId, selectedCharacterId) {
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.selectedComicId = selectedComicId;
            this.selectedCharacterId = selectedCharacterId;
        }

        /**
         * Variables declaration
         */
        let $error = $('.error');
        var movieList = [];
        var filters = [];
        var requestedFilter = [];
        var $typeSwitch = $('#type');
        var $divMovies = $('.moviesCatalog');
        var mode = 'characters';
        var showChar = 55; // How many characters are shown by default
        var ellipsesText = "...";
        var moreText = "Mostrar sinopsis completa";
        var lessText = "Ocultar sinopsis completa";
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        var userList = JSON.parse(localStorage.getItem('userList'));
        if (userList == null)
            userList = [];
        var ratingData = JSON.parse(localStorage.getItem('ratingData'));
        if (ratingData == null)
            ratingData = [];
        var userName = localStorage.getItem('currentUser');
        var $modeSelected = $('.nav').find('a');
        $search = $('.search');
        // $('body').css("background-image", "url(img/bg1.jpg");

        movieList = JSON.parse(localStorage.getItem('movieList'));
        if (movieList === null) {
            localStorage.setItem('movieList', JSON.stringify(films));
            movieList = films;
        }

        /**
         * Checks if the user is logged.
         */
        printCards(movieList);

        /**
         * Function to print the cards, that contains the information from the item, on the container
         * @param  {OBJECT} list - Json with the items
         */
        function printCards(list) {

            $divMovies.children().remove();

            if (list.length !== 0) {
                for (let i = 0; i < list.length; i++) {
                    // $div.append($('<div class="card border-primary mb-3">'));
                    $divMovies.append($('<div class="card">'));
                    $divMovies.children('.card').eq(i).append(
                        $(`<img src="${list[i].poster}" 
                        id="${list[i].id}" alt="${list[i].title}" 
                        title="${list[i].title}" class="rate card-img-top"/>
                        <div class="card-block text-center">`));
                    let title = list[i].title;
                    if (title.length > 20)
                        title = list[i].title.substr(0, 20) + '...';
                    $divMovies.children().find('.card-block').eq(i).append(
                        $(`<h4 class="card-header">${title}</h4>
                        <button type="button" class="btn btn-elegant" data-toggle="modal" 
                        data-target="#details" data-card="com-${list[i].id}">Más info</button>`));
                }
            } else {
                $div.append($('<p>No results found</p>'));
            }

            /**
             * It make the item description shorter, showing tags to show more and less
             */
            $('.moreModal').each(function () {
                var content = $(this).html();
                if (content.length > showCharModal) {
                    var c = content.substr(0, showCharModal);
                    var h = content.substr(showCharModal, content.length - showCharModal);
                    var html = c + '<span class="moreellipses">' + ellipsesText + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moreText + '</a></span>';
                    $(this).html(html);
                }
            });
            $('.more').each(function () {
                var content = $(this).html();
                if (content.length > showChar) {
                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar, content.length - showChar);
                    var html = c + '<span class="moreellipses">' + ellipsesText + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moreText + '</a></span>';
                    $(this).html(html);
                }

            });

            $(".morelink").click(function () {
                if ($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).html(moreText);
                } else {
                    $(this).addClass("less");
                    $(this).html(lessText);
                }
                $(this).parent().prev().toggle();
                $(this).prev().toggle(); return false;
            });
        }

        /**
         * On windows scroll shows a button to scroll back to the top
         */
        $(window)
            .scroll(function () {
                if ($(this).scrollTop() >= 50) { // If page is scrolled more than 50px
                    $('#return-to-top').fadeIn(200); // Fade in the arrow
                } else {
                    $('#return-to-top').fadeOut(200); // Else fade out the arrow
                }
            });
        $('#return-to-top').click(function () { // When arrow is clicked
            $('body,html').animate({
                scrollTop: 0 // Scroll to top of body
            }, 500);
        });

        /**
         * It reads the data from the item, and these is shown in the modal
         */
        $('#details').on('show.bs.modal', (event) => {
            let modal = $('#details');
            // let btnVote = $('#vote');
            var button = $(event.relatedTarget); // Button that triggered the modal
            var dataId = button.data('card').split('-')[1]; // Extract info from data-card attributes
            modal.find('.weekDays').children().remove();
            modal.find('.days').children().remove();
            let daysWeek = sortDays();
            let nowTime;
            let j = 0;
            movieList.forEach(e => {
                if (e.id == dataId) {
                    modal.find('img').attr('src', e.poster).attr('id', dataId);
                    modal.find('.modal-title').text(e.title);
                    modal.find('.plot').text(e.plot);
                    modal.find('.filmDetails').children().remove();
                    modal.find('.filmDetails').append(`
                    <h4>Información</h4>
                    <span class="badge badge-warning">${e.class}</span>
                    <span class="badge badge-dark">${e.duration}</span>`);
                    e.genre.split(',').forEach(function (e) {
                        modal.find('.filmDetails').append(`
                    <span class="badge badge-danger">${e}</span>`);
                    });
                    modal.find('.filmDetails').append(`
                    <div class="row">
                        <div class="col-sm-2">
                            <p>Título</p>
                            <p>País</p>
                            <p>Estudio</p>
                            <p>Reparto</p>
                        </div>
                        <div class="col-sm-10">
                            <p>${e.title}</p>
                            <p>${e.country}</p>
                            <p>${e.studio}</p>
                            <p>${e.cast}</p>
                        </div>
                    </div>`);
                    nowTime = new Date();
                    day = nowTime.getDate();
                    daysWeek.forEach((dw) => {
                        switch ((nowTime.getMonth() + 1)) {
                            case 4:
                            case 6:
                            case 9:
                            case 11:
                                if (day > 30)
                                    day = 1;
                                break;
                            case 2:
                                if (day > 28)
                                    day = 1;
                                break;
                            default:
                                if (day > 31)
                                    day = 1;
                                break;
                        }
                        modal.find('.weekDays').append(`<td scope="col">${dw} ${day}</td>`);
                        day++;

                        for (let i = 0; i < 7; i++)
                            modal.find('.days').append(`<tr class="table-light"></tr>`);
                        for (let i = 0; i < e.schedule[dw].length; i++ , j++)
                            modal.find('.table-light').eq(j).append(`<td>${e.schedule[dw][i]}</td>`);
                        j = 0;
                    });
                }
            });
            $('#schedule td').click((e) => {
                $error.children().remove();
                modal.find('td').map((idx, e) => e.removeAttribute('class', 'bg-info'));
                e.currentTarget.setAttribute('class', 'bg-info');
                let id = modal.find('img').attr('id');
                let hour = e.currentTarget.textContent;
                let dayW = modal.find('td').eq(e.currentTarget.cellIndex).text().split(' ');
                let month;

                localStorage.setItem('selectedFilm', JSON.stringify({
                    'id': id,
                    'dayWeek': dayW[0],
                    'day': dayW[1],
                    'hour': hour
                }));
                isThereTime(e.currentTarget.textContent, e, modal);
            });
        });

        function sortDays() {
            var today = new Date().getDay();
            var sortedList = daysOfWeek.slice(today).concat(daysOfWeek.slice(0, today));
            return sortedList;
        }

        function isThereTime(hour, evt, modal) {
            let now = new Date();
            let nowTime = now.getHours() + ':' + now.getMinutes();
            let today = '1/1/1999 ';
            if (new Date(today + '20:20') > new Date(today + hour)) {
                movieList.forEach(e => {
                    if (e.id == modal.find('img').attr('id'))
                        if (modal.find('th').eq(evt.currentTarget.cellIndex).text() === daysOfWeek[now.getDay()]) {
                            // let celIdx = evt.currentTarget.cellIndex;
                            // let rowIdx = evt.target.parentElement.rowIndex;
                            // modal.find('tr').eq(rowIdx).children().eq(celIdx).unbind("click").removeClass('bg-info').addClass('bg-dark');
                        }
                });
            }
        }

        /**
         * It read the form and save the user data in case is a new user
         */
        var $form = $('#register');

        $form.submit(function (evt) {
            let modal = $('#details');
            let td = modal.find('td');
            let any = 0;
            td.each(function (idx, e) {
                if ($(e).hasClass('bg-info'))
                    any++;
            });
            if (any === 0) {
                evt.preventDefault();
                $error.children().remove();
                $error.append(`<div class="alert alert-danger" role="alert">
                            Debe seleccionar una hora
                        </div>`);
                $('#collapseTwo').collapse('show');
            }
            // $userData = $form.find('input');
            // if (userName !== '') {
            //     let user = new User($userData[0].value, $userData[2].value, $userData[1].value, '', '');
            //     userName = $userData[0].value;
            //     userList.push(user);
            //     localStorage.setItem('userList', JSON.stringify(userList));
            //     localStorage.setItem('currentUser', userName);
            //     isLogin();
            // } else
            //     userName = localStorage.getItem('currentUser');
            // vote();
        });
        function resize() {
            var n = $("body").width() / 17 + "pt";
            $("h1").css('fontSize', n);
        }
        $(window).on("resize", resize);
        $(document).ready(resize);
    });