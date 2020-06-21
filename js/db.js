//offline data
db.enablePersistence()
.catch(error=>{
    if(error.code == 'failed-precondition'){
        console.log('persistence failed');
        
    }else if(error.code == 'unimplemented' ){
        console.log('persistence is ot available');
        
    }
})

//real time listeners
db.collection('recipies').onSnapshot((snapshot)=>{
    console.log('firestore...', snapshot.docChanges());

    snapshot.docChanges().forEach((change)=>{
        console.log(change, change.doc.data(), change.doc.id);
        
        if(change.type === 'added'){
            renderRecipe(change.doc.data(), change.doc.id);
        }

        if(change.type === 'removed'){
            removeRecipe(change.doc.id);
        }
    })
    
});

//add new recipe from form
const form = document.querySelector('form');
form.addEventListener('submit', event=>{
    event.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipies').add(recipe)
    .catch(error=>console.log(error));

    form.title.value = '';
    form.ingredients.value = '';
});


//Delete recipies 
const remove = document.querySelector('.recipes')
remove.addEventListener('click',event=>{
    if(event.target.tagName == 'I'){
        const id = event.target.getAttribute('data-id');
        db.collection('recipies').doc(id).delete();
    }
});