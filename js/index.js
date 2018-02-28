$(document).ready(function(){RatingData=function(type,name,id,rate){this.type=type
    this.name=name;this.id=id;this.rate=rate};User=function(name,phone,email,selectedComicId,selectedCharacterId){this.name=name;this.phone=phone;this.email=email;this.selectedComicId=selectedComicId;this.selectedCharacterId=selectedCharacterId}
    let $error=$('.error');var movieList=[];var filters=[];var requestedFilter=[];var $typeSwitch=$('#type');var $divMovies=$('.moviesCatalog');var mode='characters';var showChar=55;var ellipsesText="...";var moreText="Mostrar sinopsis completa";var lessText="Ocultar sinopsis completa";const daysOfWeek=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];var userList=JSON.parse(localStorage.getItem('userList'));if(userList==null)
    userList=[];var ratingData=JSON.parse(localStorage.getItem('ratingData'));if(ratingData==null)
    ratingData=[];var userName=localStorage.getItem('currentUser');var $modeSelected=$('.nav').find('a');$search=$('.search');movieList=JSON.parse(localStorage.getItem('movieList'));if(movieList===null){localStorage.setItem('movieList',JSON.stringify(films));movieList=films}
    printCards(movieList);function printCards(list){$divMovies.children().remove();if(list.length!==0){for(let i=0;i<list.length;i++){$divMovies.append($('<div class="card">'));$divMovies.children('.card').eq(i).append($(`<img src="${list[i].poster}" 
                            id="${list[i].id}" alt="${list[i].title}" 
                            title="${list[i].title}" class="rate card-img-top"/>
                            <div class="card-block text-center">`));let title=list[i].title;if(title.length>20)
    title=list[i].title.substr(0,20)+'...';$divMovies.children().find('.card-block').eq(i).append($(`<h4 class="card-header">${title}</h4>
                            <button type="button" class="btn btn-elegant btn-sm" data-toggle="modal" 
                            data-target="#details" data-card="com-${list[i].id}">Más info</button>`))}}else{$div.append($('<p>No results found</p>'))}
    $('.moreModal').each(function(){var content=$(this).html();if(content.length>showCharModal){var c=content.substr(0,showCharModal);var h=content.substr(showCharModal,content.length-showCharModal);var html=c+'<span class="moreellipses">'+ellipsesText+'&nbsp;</span><span class="morecontent"><span>'+h+'</span>&nbsp;&nbsp;<a href="" class="morelink">'+moreText+'</a></span>';$(this).html(html)}});$('.more').each(function(){var content=$(this).html();if(content.length>showChar){var c=content.substr(0,showChar);var h=content.substr(showChar,content.length-showChar);var html=c+'<span class="moreellipses">'+ellipsesText+'&nbsp;</span><span class="morecontent"><span>'+h+'</span>&nbsp;&nbsp;<a href="" class="morelink">'+moreText+'</a></span>';$(this).html(html)}});$(".morelink").click(function(){if($(this).hasClass("less")){$(this).removeClass("less");$(this).html(moreText)}else{$(this).addClass("less");$(this).html(lessText)}
    $(this).parent().prev().toggle();$(this).prev().toggle();return!1})}
    $(window).scroll(function(){if($(this).scrollTop()>=50){$('#return-to-top').fadeIn(200)}else{$('#return-to-top').fadeOut(200)}});$('#return-to-top').click(function(){$('body,html').animate({scrollTop:0},500)});$('#details').on('show.bs.modal',(event)=>{let modal=$('#details');var button=$(event.relatedTarget);var dataId=button.data('card').split('-')[1];modal.find('.weekDays').children().remove();modal.find('.days').children().remove();let daysWeek=sortDays();let nowTime;let j=0;movieList.forEach(e=>{if(e.id==dataId){modal.find('img').attr('src',e.poster).attr('id',dataId);modal.find('.modal-title').text(e.title);modal.find('.plot').text(e.plot);modal.find('.filmDetails').children().remove();modal.find('.filmDetails').append(`
                        <h4>Información</h4>
                        <span class="badge badge-warning">${e.class}</span>
                        <span class="badge badge-dark">${e.duration}</span>`);e.genre.split(',').forEach(function(e){modal.find('.filmDetails').append(`
                        <span class="badge badge-danger">${e}</span>`)});modal.find('.filmDetails').append(`
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
                        </div>`);nowTime=new Date();day=nowTime.getDate();daysWeek.forEach((dw)=>{switch((nowTime.getMonth()+1)){case 4:case 6:case 9:case 11:if(day>30)
    day=1;break;case 2:if(day>28)
    day=1;break;default:if(day>31)
    day=1;break}
    modal.find('.weekDays').append(`<td scope="col">${dw} ${day}</td>`);day++;for(let i=0;i<7;i++)
    modal.find('.days').append(`<tr class="table-light"></tr>`);for(let i=0;i<e.schedule[dw].length;i++,j++)
    modal.find('.table-light').eq(j).append(`<td>${e.schedule[dw][i]}</td>`);j=0})}});$('#schedule td').click((e)=>{$error.children().remove();modal.find('td').map((idx,e)=>e.removeAttribute('class','bg-info'));e.currentTarget.setAttribute('class','bg-info');let id=modal.find('img').attr('id');let hour=e.currentTarget.textContent;let dayW=modal.find('td').eq(e.currentTarget.cellIndex).text().split(' ');let month;localStorage.setItem('selectedFilm',JSON.stringify({'id':id,'dayWeek':dayW[0],'day':dayW[1],'hour':hour}));isThereTime(e.currentTarget.textContent,e,modal)})});function sortDays(){var today=new Date().getDay();var sortedList=daysOfWeek.slice(today).concat(daysOfWeek.slice(0,today));return sortedList}
    function isThereTime(hour,evt,modal){let now=new Date();let nowTime=now.getHours()+':'+now.getMinutes();let today='1/1/1999 ';if(new Date(today+'20:20')>new Date(today+hour)){movieList.forEach(e=>{if(e.id==modal.find('img').attr('id'))
    if(modal.find('th').eq(evt.currentTarget.cellIndex).text()===daysOfWeek[now.getDay()]){}})}}
    var $form=$('#register');$form.submit(function(evt){let modal=$('#details');let td=modal.find('td');let any=0;td.each(function(idx,e){if($(e).hasClass('bg-info'))
    any++});if(any===0){evt.preventDefault();$error.children().remove();$error.append(`<div class="alert alert-danger" role="alert">
                                Debe seleccionar una hora
                            </div>`);$('#collapseTwo').collapse('show')}})})