// ==UserScript==
// @name         Digitaly imported adv muter
// @namespace    https://mihanentalpo.me/
// @version      0.1
// @description  Mute sound, then adverstment is played on di.fm
// @author       Mihanentalpo
// @match        http://www.di.fm/*
// @grant        none
// ==/UserScript==

//Counter of checks
var advMuteCheckCount = 0;
//Is debug box need to be showed?
var displayDebugBox = false;

/**
* Check is volume muted
*/
function isVolumeMuted()
{
    return jQuery('a[aria-label=volume]').hasClass('icon-mute');
}

/**
* Emulate click on "mute" button
*/
function volumeClick()
{
    jQuery('a[aria-label=volume]').trigger('click');
}

/**
* Check, if adverstment playing
*/
function isAdverstmentPlaying()
{
    return $('.close-spinner').css('display') != 'none';
}

/**
* Display debug box
*/
function addDebugBlock() {    
    jQuery("body").append("<div id='debugBlock' style='position:fixed; left:10px; top:10px; font-size:8px; opacity: 0.5; background:white; border-radius:5px; z-index:9999; color:black; padding:4px; box-shadow: 3px 3px 20px 3px rgba(0,0,0,0.75);'></div>");
}

/**
* Show debug html message
* @param string html - code to display
* @param boolean append - is need to be appended to old messages (or replace it)
*/
function debug(html, append)
{
    if (!displayDebugBox) return;
    if (!jQuery('#debugBlock').length) addDebugBlock();
    append = append || false;
    if (append) html = jQuery('#debugBlock').html() + "<br>" + html; 
    jQuery('#debugBlock').html(html);
}

/**
* Check for adverstment, and mute (or unmute) if needed
*/
function checkAdv()
{
    var append = true;
    var msg = "checkAdv #" + advMuteCheckCount + ", display:" + $('.close-spinner').css('display') + "(" + (isAdverstmentPlaying() ? "TRUE" : "FALSE") + ")";
    advMuteCheckCount +=1;
    if (advMuteCheckCount % 10 == 0) append = false;
    debug(msg, append);
    //Если реклама играет
    if (isAdverstmentPlaying())
    {
        //Если звук не выключен
        if (!isVolumeMuted())
        {
            //Выключаем
            volumeClick();
            debug("SWITCHING OFF ADV!!!", true);
        }
    }
    else
    {
        if (isVolumeMuted())
        {
            //Включаем
            volumeClick();
            debug("SWITCHING ON MUSIC!!!", true);
        }
    }
        
}

/**
* Check for modal window, and close it
*/
function checkModal() {
    if ($('.modal-dialog').is(':visible')) {
        $('button[data-dismiss=modal]').trigger('click');
    }
}

/**
* Run everysecond check
*/
$(function() 
{
    debug("AdvMute Init!");

    setInterval(checkAdv, 1000);
    setInterval(checkModal, 1000);
});

