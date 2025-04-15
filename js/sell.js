document.addEventListener('DOMContentLoaded', () => {
  const supabase = Supabase.createClient(
    'https://acumblomcsqqdnzvgtoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdW1ibG9tY3NxcWRuenZndG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMyNTIsImV4cCI6MjA2MDI5OTI1Mn0.rB0iufdofpEDeqopbJGgMy5TNsfBS7zaE2EIZkHKL7Q'
  );

  const loadListings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: listings } = await supabase.from('listings').select('*').eq('seller', user.email);
    const listingsDiv = document.getElementById('user-listings');
    listingsDiv.innerHTML = '';
    listings.forEach(listing => {
      const div = document.createElement('div');
      div.className = 'listing-card';
      div.innerHTML = `
        <h4>${listing.title}</h4>
        <p>Price: ₹${listing.price}</p>
        <button onclick="deleteListing(${listing.id})">Remove</button>
      `;
      listingsDiv.appendChild(div);
    });
  };

  loadListings();

  const sellForm = document.getElementById('sell-form');
  if (sellForm) {
    sellForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = document.getElementById('type').value;
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const price = document.getElementById('price').value;
      const image = document.getElementById('image').files[0];
      const { data: { user } } = await supabase.auth.getUser();

      let imageUrl = 'assets/default-profile.jpg';
      if (image) {
        const { data, error } = await supabase.storage
          .from('listings')
          .upload(`${Date.now()}_${image.name}`, image);
        if (error) {
          alert('Image upload failed: ' + error.message);
          return;
        }
        imageUrl = supabase.storage.from('listings').getPublicUrl(`${Date.now()}_${image.name}`).publicURL;
      }

      await supabase.from('listings').insert({
        id: Date.now(),
        type,
        title,
        description,
        price,
        image: imageUrl,
        seller: user.email,
      });

      alert('Listing created!');
      sellForm.reset();
      loadListings();
    });
  }
});

async function deleteListing(id) {
  const supabase = Supabase.createClient(
    'https://acumblomcsqqdnzvgtoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdW1ibG9tY3NxcWRuenZndG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMyNTIsImV4cCI6MjA2MDI5OTI1Mn0.rB0iufdofpEDeqopbJGgMy5TNsfBS7zaE2EIZkHKL7Q'
  );

  await supabase.from('listings').delete().eq('id', id);
  alert('Listing removed!');
  loadListings();
}