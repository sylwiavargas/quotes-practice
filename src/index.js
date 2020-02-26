// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener('DOMContentLoaded', (event) => {
    let quoteUl = document.querySelector("ul#quote-list")
    let form = document.querySelector("form")
    // debugger
    form.addEventListener("submit", (e) => postQuote(e))

    fetch('http://localhost:3000/quotes')  
    .then(response => response.json())  
    .then(quotes => quotes.forEach(quote => slapItOnTheDOM(quote)))

    function getData(event){
        let {target} = event
        let quote = target.quote.value
        let author = target.author.value

        return{
            quote,
            author
        }

        // return {
        //     quote: event.target.quote.value,
        //     author: event.target.author.value
        // }
    }

    function postQuote(event){
        event.preventDefault()
        console.log("hi")
        // 0. preventDefault
        // 1. console.log event
        console.log(event)
        // 2. gathering the data
        let data = getData(event)
        console.log(data)
        // 3. perform the fetch
        return fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(quote => slapItOnTheDOM(quote))
        // 4. add the data
    }

    function slapItOnTheDOM(quoteObj) {
        // 1. adding the innerHTML to the Ul
        // remember to += instead of =
        // 2. TEST IT

        // quoteUl.innerHTML += `
        //     <li class='quote-card'>
        //     <blockquote class="blockquote">
        //     <p class="mb-0">${quoteObj.quote}</p>
        //     <footer class="blockquote-footer">${quoteObj.  author}</footer>
        //     <br>
        //     <button class='btn-success'>Likes: <span>0</span></button>
        //     <button class='btn-danger'>Delete</button>
        //     </blockquote>
        // </li>
        // `

    // console.log("it worked!");
    // let likeBtn = document.querySelector("button.btn-success")
    // likeBtn.addEventListener("click", () => {console.log("like button was clicked")})

    //////////// LET'S CREATE ALL THE ELEMENTS INSTEAD////
        let quoteLi = document.createElement("li")
        let quoteBlockquote = document.createElement("blockquote")
        let quoteP = document.createElement("p")
        let quoteFooter = document.createElement("footer")
        let quoteBr = document.createElement("br")
        let quoteLikeBtn = document.createElement("button")
        let likeBtnSpan = document.createElement("span")
        let quoteDeleteBtn = document.createElement("button")

        quoteLi.setAttribute("class", "quote-card")
        quoteLi.setAttribute("id", `quote-li-${quoteObj.id}`)
        quoteBlockquote.setAttribute("class", "blockquote")
        quoteP.setAttribute("class", "mb-0")
        quoteFooter.setAttribute("class", "blockquote-footer")
        quoteLikeBtn.setAttribute("class", "btn-success")
        quoteLikeBtn.setAttribute("id", `quote-like-btn-${quoteObj.id}`)
        likeBtnSpan.setAttribute("id", `#quote-like-span-${quoteObj.id}`)
        quoteDeleteBtn.setAttribute("class", "btn-danger")
        quoteDeleteBtn.setAttribute("id", `quote-delete-btn-${quoteObj.id}`)

        quoteLi.dataset.id = quoteObj.id

        quoteP.innerText = quoteObj.quote
        quoteFooter.innerText = quoteObj.author
        quoteLikeBtn.innerText = "Likes:"
        likeBtnSpan.innerText = "0"
        quoteDeleteBtn.innerText = "Delete"

        quoteLi.append(quoteBlockquote)
        quoteBlockquote.append(quoteP, quoteFooter, quoteBr, quoteLikeBtn, quoteDeleteBtn)
        quoteLikeBtn.append(likeBtnSpan)
        
        quoteUl.append(quoteLi)

        quoteLikeBtn.addEventListener("click", (event) => likeMe(event, quoteObj))

        quoteDeleteBtn.addEventListener("click", () => deleteForever(quoteObj))

        // console.log(quoteLi);
        // console.log(quoteBlockquote);
        // console.log(quoteP);
        // console.log(quoteFooter);
        // console.log(quoteBr);
        // console.log(quoteLikeBtn);
        // console.log(quoteDeleteBtn);
        // console.log(likeBtnSpan);
    }

    function deleteForever(quoteObj){
        // 1. identify all the things you want gone from the frontend
        let liBye = document.getElementById(`quote-li-${quoteObj.id}`)
            // console.log(liBye)
        // 2. make sure you have a way of getting an object id
            // console.log("goodbye forever", quoteObj)
        // 3. do the fetch and then delete what needs to be gone
        return fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(() => {
            liBye.remove()
            console.log(`goodbye ${quoteObj.id}`)
            }
        )
    }

    function likeMe(event, quoteObj) {
        // 1. console.log quoteObj, event
            // console.log(event, quoteObj);
        // 2. fetch POST request to `http://localhost:3000/likes`

        // 3. update the likes button's span 
        let span = event.target.firstElementChild
        let spanInnerText = span.innerText
        let increasedLikes = parseInt(spanInnerText) + 1

        // debugger
        return fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({quoteId: quoteObj.id})
        })
        .then(res => res.json())
        .then(data  => {
            console.log(data)
            event.target.querySelector("span").innerText = increasedLikes
        }
        )
    }

});