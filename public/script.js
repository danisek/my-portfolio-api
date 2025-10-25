fetch('/api/projects')
  .then(res => res.json())
  .then(data => {
    console.log(data); // You’ll see the array in DevTools
    // You can now render it dynamically
  });

  //POST
  // fetch('/api/projects', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     title: "Another New Project2",
  //     description: "Created via frontend",
  //     tags: ["JavaScript", "Frontend"]
  //   })
  // })
  // .then(res => res.json())
  // .then(data => console.log('Project added:', data));


  //PUT (update)
  fetch('/api/projects/2', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Daniel Updated Title",
      tags: ["JavaScript", "Security"],
      newField: "This wasn't here before"
    })
  })
  .then(res => res.json())
  .then(data => console.log('Updated project:', data));
  

  //DELETE
  // fetch('/api/projects/1', {
  //   method: 'DELETE'
  // })
  // .then(res => res.json())
  // .then(data => console.log('Deleted:', data));
 
  






  
  // {
//   "id": 1,
//   "title": "Web Project",
//   "description": "Responsive site with HTML/CSS/JS",
//   "tags": [
//     "HTML",
//     "CSS",
//     "JavaScript"
//   ]
// }