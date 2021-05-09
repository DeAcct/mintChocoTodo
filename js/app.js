document.addEventListener('DOMContentLoaded', ()=>{
    /*문서 객체 가져오기*/
    const App = document.querySelector('.app');
    const input = document.querySelector('#todo');
    const addBtn = document.querySelector('#addBtn');
    const todoList = document.querySelector('#TodoList');
    const header = document.querySelector('header');
    const heading = document.querySelector('header h1');

    const Time = ()=>{
        let date = new Date();
        return `${date.getMonth()+1}월 ${date.getDate()}일`
    }

    /*입력받기*/
    let keyCount = 0;

    /*할 일 추가하기*/
    const addTodo = () => {
        keyCount++
        if(input.value.trim() === ''){
            showToast('error', '할 일을 입력해 주세요');
            return
        }

        const key = keyCount;

        const DOs = document.createElement('div')
        DOs.setAttribute('data-key', keyCount)
        DOs.classList.add('DOs')

        const shadowCheckbox = document.createElement('input')
        shadowCheckbox.setAttribute('type', 'checkbox')
        shadowCheckbox.id = `key${keyCount}`

        const checkbox = document.createElement('span')
        checkbox.classList.add('checkbox')

        const text = document.createElement('div')
        text.classList.add('text')
        
        const p = document.createElement('p')
        p.textContent = input.value

        const time = document.createElement('span')
        time.textContent = Time()

        text.appendChild(p)
        text.appendChild(time)
        
        const label = document.createElement('label');
        label.setAttribute('for', `key${keyCount}`);
        label.appendChild(shadowCheckbox);
        label.appendChild(checkbox);
        label.appendChild(text);

        DOs.appendChild(label)

        
        const removeBtn = document.createElement('button')
        removeBtn.textContent = '할 일 취소'
        removeBtn.addEventListener('click',()=>{
            removeTodo(key)
        })
        DOs.appendChild(removeBtn)
        
        let startX;
        let amount;
        DOs.addEventListener('touchstart', (event) => {
            const start = event.touches[0];
            startX = start.screenX;
        })
        DOs.addEventListener('touchmove', (event)=>{
            amount = (startX-event.touches[0].screenX)*-1
            event.currentTarget.style.transform = `translateX(${amount}px)`
        },true)
        DOs.addEventListener('touchend', (event) => {
            let current = event.currentTarget;
            if (event.touches.length===0){
                const end = event.changedTouches[event.changedTouches.length - 1];
                const endX = end.screenX;
    
                if(startX-endX>200){
                    current.style.transform = 'translateX(-100vw)'
                    current.style.transition = '150ms ease-out'
                    setTimeout(()=>{
                        removeTodo(key)
                    },150)
                }
                else if(startX-endX<-200){
                    current.style.transform = 'translateX(100vw)'
                    current.style.transition = '150ms ease-out'
                    setTimeout(()=>{
                        removeTodo(key)
                    },150)
                }
                else{
                    if((startX-endX<-100 || startX-endX>100)&&isScroll){
                        showToast('info','삭제하려면 더 세게 밀어주세요')
                    }
                    current.style.transform = 'translateX(0)'
                    current.style.transition = '150ms ease-out'
                    setTimeout(()=>{
                        current.style.transition = 'none'
                    },150)
                }
            }
        })

        todoList.append(DOs)
        input.value = ''
        input.focus()
    }
    let [oldScroll,nowScroll] = [0,0];
    window.addEventListener('scroll',()=>{
        nowScroll = Math.round(scrollY)
        if(nowScroll>oldScroll){
            header.style.paddingTop = '20px'
            heading.style.fontSize = '2rem'
        }
        else if(nowScroll<oldScroll){
            header.style.paddingTop = '90px'
            heading.style.fontSize = '3rem'
        }
        oldScroll = Math.round(scrollY)
    })

    
    const toast = document.createElement('div');
    toast.classList.add('toast')
    const toastWrap = document.createElement('div');
    toastWrap.classList.add('toastWrap')
    const toastIcon = document.createElement('span');
    toastIcon.textContent = '!'
    toastIcon.classList.add('toastIcon')
    const toastCont = document.createElement('p');

    toastWrap.appendChild(toastIcon)
    toastWrap.appendChild(toastCont)
    toast.appendChild(toastWrap)
    App.appendChild(toast)
    
    /*토스트 보여주기*/
    const showToast = (level, text)=>{
        toast.style.bottom = 50+'px'
        toastIcon.style.backgroundColor = `var(--${level}Icon)`
        toastIcon.style.color = `var(--${level}Exclamation)`
        toastCont.textContent = text
        setTimeout(()=>{
            toast.style.bottom = 0
        },1500)
    }


    /*할 일 지우기*/ 
    const removeTodo = (key)=>{
        const item = document.querySelector(`[data-key="${key}"]`)
        todoList.removeChild(item)
    }

    addBtn.addEventListener('click',addTodo);
    input.addEventListener('keyup', (event)=>{
        const enterKEY = 13
        if (event.keyCode===enterKEY){
            addTodo()
        }
    })



    /*
    개발 예정
    1. 스크롤 시 헤더 위로 고정, h1 작게해서 왼쪽으로 배치
    2. localStorage객체
    3. PWA
    */
});