async function User() {
    const res = await fetch("http://jsonplaceholder.typicode.com/users", {
        cache: "no-cache"
    });
    const users = await res.json();

    return (
        <div>
           <div>
               {users.map((user : any) => (
                   <div key={user.id}>{user.name}</div>
               ))}
           </div>

        </div>
    );
}

export default User;
