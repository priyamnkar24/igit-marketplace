document.addEventListener('DOMContentLoaded', () => {
  const supabase = Supabase.createClient(
    'https://acumblomcsqqdnzvgtoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdW1ibG9tY3NxcWRuenZndG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMyNTIsImV4cCI6MjA2MDI5OTI1Mn0.rB0iufdofpEDeqopbJGgMy5TNsfBS7zaE2EIZkHKL7Q'
  );

  const displayListings = async () => {
    const filter = document.getElementById('filter').value;
    let query = supabase.from('listings').select('*');
    if (filter !== 'all') query = query.eq('type', filter);

    const { data: listings } = await query;
    const listingsDiv = document.getElementById('listings');
    listingsDiv.innerHTML = '';
    listings.forEach(listing => {
      const card = document.createElement('div');
      card.className = 'listing-card';
      card.innerHTML = `
        <img src="${listing.image}" alt="${listing.title}">
        <h3>${listing.title}</h3>
        <p>Price: ₹${listing.price}</p>
      `;
      card.addEventListener('click', () => showModal(listing));
      listingsDiv.appendChild(card);
    });
  };

  displayListings();

  const filter = document.getElementById('filter');
  if (filter) filter.addEventListener('change', displayListings);

  const modal = document.getElementById('item-modal');
  const close = document.querySelector('.close');
  if (close) {
    close.addEventListener('click', () => modal.style.display = 'none');
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

async function showModal(listing) {
  const supabase = Supabase.createClient(
    'https://acumblomcsqqdnzvgtoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdW1ibG9tY3NxcWRuenZndG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMyNTIsImV4cCI6MjA2MDI5OTI1Mn0.rB0iufdofpEDeqopbJGgMy5TNsfBS7zaE2EIZkHKL7Q'
  );

  const { data: seller } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', (await supabase.from('profiles').select('id').eq('email', listing.seller)).data[0].id)
    .single();

  document.getElementById('modal-image').src = listing.image;
  document.getElementById('modal-title').textContent = listing.title;
  document.getElementById('modal-description').textContent = listing.description;
  document.getElementById('modal-price').textContent = `Price: ₹${listing.price}`;
  document.getElementById('modal-seller').textContent = `Seller: ${seller.username || listing.seller}`;
  document.getElementById('item-modal').style.display = 'block';

  const contactButton = document.getElementById('contact-seller');
  contactButton.onclick = () => {
    localStorage.setItem('chatWith', listing.seller);
    window.location.href = 'chat.html';
  };
}