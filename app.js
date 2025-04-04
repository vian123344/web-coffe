document.addEventListener('alpine:init', () => {
    Alpine.data('produk', () => ({
        items: [
            { id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 20000 },
            { id: 2, name: 'Arabica Blend', img: '2.jpg', price: 25000 },
            { id: 3, name: 'Primo Passo', img: '3.jpg', price: 30000 },
            { id: 4, name: 'Aceh Gayo', img: '4.avif', price: 35000 },
            { id: 5, name: 'Sumatra Mandheling', img: '5.avif', price: 40000 }
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // Cek apakah ada barang yang smaa di cards
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // Jika belum ada / cart masih kosong
            if( !cartItem) {
                this.items.push({...newItem, quantity: 1, total:newItem.price})
                this.quantity ++;
                this.total += newItem.price
                console.log(this.total)
            } else {
                // Jika barang usdah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda 
                    if((item.id !== newItem.id)) {
                        return item;
                    } else {
                        // jika barang sudah ada
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity ++;
                        this.total += newItem.price
                        return item;
                    }
                }); 
            }
        },
        remove(id) {
            // Ambil item yang mau diremove berdasarkan id nya
            const cardsItems = this.items.find((item) => item.id === id) 

            // Jika item lebih dari 1
            if( cardsItems.quantity > 1) {
                // telusuri 1 1 
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if( item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity --;
                        this.total -= item.price;
                        return item;
                    }
                })
            } else if (cardsItems.quantity === 1) {
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cardsItems.price
            }
        }
    });
});


// Form Validation
const jos = document.querySelector('.jos')
jos.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if( form.elements[i].value.length !== '') {
            jos.classList.remove('disabled');
            jos.classList.add('disabled');
        } else {
            return false;
        }
    }
    jos.disabled = false
    jos.classList.remove('disabled')
});

// Kirim data ketika tombol checkout di klik
jos.addEventListener('click', function(e) {
   e.preventDefault();
   const fromData = new FormData(form);
   const data = new URLSearchParams(fromData);
   const objData = Object.fromEntries(data);
   const message = formatMassage(objData);
   window.open('http://wa.me/6285655883245?text=' + encodeURIComponent(message));
})

const formatMassage = (obj) => {
   return `Data Customer
   Nama: ${obj.name},
   Email: ${obj.email},
   No Hp: ${obj.phone}
Data Pesanan
   ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}   
TOTAL: ${rupiah(obj.total)} 
Terima Kasih.`;
}

// Konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
}).format(number);
}