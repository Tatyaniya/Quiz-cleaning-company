document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const overlay = document.querySelector('.overlay');
    const quiz = document.querySelector('.quiz');
    const passTestButton = document.querySelector('.pass-test__button');
    const form = document.querySelector('.form');
    const formItems = form.querySelectorAll('fieldset');
    const btnsNext = form.querySelectorAll('.form-button__btn-next');
    const btnsPrev = form.querySelectorAll('.form-button__btn-prev');

    btnsNext.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            formItems[btnIndex].style.display = 'none';
            formItems[btnIndex + 1].style.display = 'block';
        });
    });

    btnsPrev.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // в блоке под индексом 1 находится кнопка 0, т.к. их на 1 меньше
            formItems[btnIndex + 1].style.display = 'none';
            formItems[btnIndex].style.display = 'block';
        });
    });

    formItems.forEach((formItem, formItemIndex) => {

        // открваем 1-й fieldset, остальныe скрываем
        if(formItemIndex === 0) {
            formItem.style.display = 'block';
        } else {
            formItem.style.display = 'none';
        }

        // убираем все классы активности в 4-х филдсетах у родителей инпутов
        if(formItemIndex !== formItems.length - 1) {
            const inputs = formItem.querySelectorAll('input');
            
            inputs.forEach((input) => {
                const parent = input.parentNode;
                
                // сбросить чекед инпутов
                input.checked = false;
                parent.classList.remove('active-radio');
                parent.classList.remove('active-checkbox');
            });
        }

        // выбор radio и checkbox
        formItem.addEventListener('change', (e) => {
            const target = e.target;

            if(target.classList.contains('form__radio')) {
                console.log(target, 'radio');
            } else if (target.classList.contains('form__input')) {
                console.log(target, 'check');
            } else {
                return;
            }
        });
    });

    overlay.style.display = 'none';
    quiz.style.display = 'none';

    passTestButton.addEventListener('click', () => {
        overlay.style.display = 'block';
        quiz.style.display = 'block';
    });

   
});