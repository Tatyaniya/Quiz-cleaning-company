document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const overlay = document.querySelector('.overlay');
    const quiz = document.querySelector('.quiz');
    const passTestButton = document.querySelector('.pass-test__button');
    const form = document.querySelector('.form');
    const formItems = form.querySelectorAll('fieldset');
    const btnsNext = form.querySelectorAll('.form-button__btn-next');
    const btnsPrev = form.querySelectorAll('.form-button__btn-prev');
    const answersObj = {
        step0: {
            question: '',
            answers: [],
        },
        step1: {
            question: '',
            answers: [],
        },
        step2: {
            question: '',
            answers: [],
        },
        step3: {
            question: '',
            answers: [],
        },
        step4: {
            name: '',
            phone: '',
            email: '',
            call: '',
        },
    }

    btnsNext.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            formItems[btnIndex].style.display = 'none';
            formItems[btnIndex + 1].style.display = 'block';
        });

        btn.disabled = true;
    });

    // btnsPrev.forEach((btn, btnIndex) => {
    //     btn.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         // в блоке под индексом 1 находится кнопка 0, т.к. их на 1 меньше
    //         formItems[btnIndex + 1].style.display = 'none';
    //         formItems[btnIndex].style.display = 'block';
    //     });
    // });

    // теперь тоже самое через for
    for (let i = 0; i< btnsPrev.length; i++) {
        btnsPrev[i].addEventListener('click', (e) => {
            e.preventDefault();
            // в блоке под индексом 1 находится кнопка 0, т.к. их на 1 меньше
            formItems[i + 1].style.display = 'none';
            formItems[i].style.display = 'block';
        });
    }

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
            const itemTitle = formItem.querySelector('.form__title');

            // при переборе филдсетов,  индекс будет меняться
            answersObj[`step${formItemIndex}`].question = itemTitle.textContent;
            
            inputs.forEach((input) => {
                const parent = input.parentNode;
                
                // сбросить checked инпутов
                input.checked = false;
                parent.classList.remove('active-radio');
                parent.classList.remove('active-checkbox');
            });
        }

        // выбор radio и checkbox
        formItem.addEventListener('change', (e) => {

            const target = e.target;
            // находим все checked элементы
            const inputsChecked = formItem.querySelectorAll('input:checked');

            if(formItemIndex !== formItems.length - 1) {
                // обнуляем ответы
                answersObj[`step${formItemIndex}`].answers.length = 0;

                // добавляем в массив все ответы на вопросы
                inputsChecked.forEach(inputChecked => {
                    answersObj[`step${formItemIndex}`].answers.push(inputChecked.value);
                });

                // если хоть что-то чекнуто
                if(inputsChecked.length > 0) {
                    // разблокировать именно эту кнопку
                    btnsNext[formItemIndex].disabled = false;
                } else {
                // заблокировать
                console.log(formItemIndex);
                btnsNext[formItemIndex].disabled = true;
                }

                // если кликнули по радио-кнопке, добавить активный класс
                if(target.classList.contains('form__radio')) {
                
                    const radioBtns = formItem.querySelectorAll('.form__radio');

                    radioBtns.forEach(input => {
                        if(input === target) {
                            // add active class
                            input.parentNode.classList.add('active-radio');
                        } else {
                            // remove active class
                            input.parentNode.classList.remove('active-radio');
                        }
                    });
                    
                } else if (target.classList.contains('form__input')) {

                    // если чекбоксы
                    // target.parentNode.classList.toggle('active-checkbox');

                    // если радио
                    const checkBtns = formItem.querySelectorAll('.form__input');

                    checkBtns.forEach(input => {
                        if(input === target) {
                            // add active class
                            input.parentNode.classList.add('active-checkbox');
                        } else {
                            // remove active class
                            input.parentNode.classList.remove('active-checkbox');
                        }
                    });

                } else {
                    return;
                }
            }
        });
    });

    const sendForm = () => {
        const lastFeilset = formItems[formItems.length - 1];
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // сначала засунем данные в объект
            answersObj.step4.name = document.getElementById('quiz-name').value;
            answersObj.step4.phone = document.getElementById('quiz-phone').value;
            answersObj.step4.email = document.getElementById('quiz-email').value;
            answersObj.step4.call = document.getElementById('quiz-call').value;

            // проверка, не пустые ли поля
            // for (let key in answersObj.step4) {
            //   if (answersObj.step4[key].value === "") {
            //     alert("Введите данные во все поля");
            //   }
            // }

            // если чекнута обработка персональных данных
            if (document.getElementById('quiz-policy').checked) {
                postData(answersObj)
                .then((res) => res.json())
                .then((res) => {
                    if (res['status'] === 'ok') {
                        overlay.style.display = 'none';
                        quiz.style.display = 'none';
                        form.reset();
                        alert(res['message']);
                    } else if (res['status'] === 'error') {
                        alert(res['message']);
                    }
                });
            } else {
                alert('Дайте согласие на обработку персональных данных');
            }
        });
    }

    const postData = (body) => {
        return fetch('./server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
    }

    overlay.style.display = "none";
    quiz.style.display = "none";

    passTestButton.addEventListener('click', () => {
        formItems.forEach((formItem, formItemIndex) => {
            if (formItemIndex === 0) {
              formItem.style.display = "block";
            } else {
              formItem.style.display = "none";
            }
      
            // сбрасываем все значения
            const inputs = formItem.querySelectorAll("input");
            inputs.forEach((input) => {
              const parent = input.parentNode;
              input.checked = false;
              parent.classList.remove("active-radio");
              parent.classList.remove("active-checkbox");
            });
        });
    
        btnsNext.forEach((btn) => {
        btn.disabled = true;
        });

        overlay.style.display = 'block';
        quiz.style.display = 'block';
    });

    sendForm();
   
});