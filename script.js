        /* input değer alma  */
        document.querySelector("#btnSearch").addEventListener("click", () => {
            let text = document.querySelector("#txtSearch").value;
            document.querySelector("#details").style.opacity = 0;
            document.querySelector("#loading").style.display = "block";
            getCountry(text);
        });
        /* navigator kullanımı */
        document.querySelector("#btnLocation").addEventListener("click", () => {
            if(navigator.geolocation) { // btnlocation id li butona tıklandığında navigator.geolocation functionu çalışacak
                document.querySelector("#loading").style.display = "block";
                navigator.geolocation.getCurrentPosition(onSuccess, onError); // getcurrentposition bizden 2 parametre ister biri uyarı diğeri adres
            }
        });

        function onError(err) { // error değeri için bir uyarı oluşturduk
            console.log(err);
            docoment.querySelector("#loading").style.display = "none";
        }


        async function onSuccess(position) { // adres içinse latitude ve longitude bilgileri yani enlem ve boylam
            let lat = position.coords.latitude; // enlem ve boylamları değişkenlere atadık
            let lng = position.coords.longitude;
            
            // api , google , opencagedata

            const api_key = "d17599a7b3074c5cad200f29b6d32f89"; // opencagedata sitesinden gelen bize özel api key i 
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}

            `; // url 

           const response = await fetch(url) // response içerisinde  url fetch ile beklenir 
           const data = await response.json(); // data json yapısını dönüştürülür

           const country = data.results[0].components.country;

            document.querySelector("#txtSearch").value = country;

            document.querySelector("#btnSearch").click();
         

        }




        /* Api'den bilgi alınan kısım */

        async function getCountry(country) {
            try {
                
                const response = await fetch('https://restcountries.com/v3.1/name/' + country)
                if (!response.ok)  // response apiden alınan bilgi.Response içerisinde hata durumunu bildiren ok parametresi var ve bu parametre true yada false değer bildirir.Bizim burada kullandığımız if yapısının açıklaması.Eğer response.ok değilse yani false ise aşağıdaki kod çalışır
                throw new Error("ülke bulunamadı")// throw new error hata fırlatma demek genel bir hata olayı ve içerisine bir hata mesajı verdik
                const data = await response.json();
                renderCountry(data[0]);
    
                const countries = data[0].borders; // data içerisinde borders bilgisini ara
                if (!countries) // eğer countries yoksa
                    throw new Error("komşu ülke bulunamadı."); // hata fırlat

                const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
                const neighbors = await response2.json();
                renderNeighbors(neighbors)
            }
            catch(err) { // hata metodunu yakalamk için kullanılır
                renderError(err)
            }
        }

        /* Alınan bilgilerin gösterilmesi */
        function renderCountry(data) {
            document.querySelector("#loading").style.display = "none";
            document.querySelector("#country-details").innerHTML= "";
            document.querySelector("#neighbors").innerHTML= "";

            let html = `        
           
                    
    <div class="col-4">
        <img src="${data.flags.png}" alt="" class="img-fluid">
    </div>
    <div class="col-8">
            <h3 class="card-title">${data.name.common}</h3>
            <hr>
        <div class="row">
            <div class="col-4">Nufüs: </div>
            <div class="col-8">${(data.population / 1000000).toFixed(1)} milyon</div>
        </div>
        <div class="row">
            <div class="col-4">Resmi Dil: </div>
            <div class="col-8">${Object.values(data.languages)}</div>
        </div>
        <div class="row">
            <div class="col-4">Başkent: </div>
            <div class="col-8">${data.capital[0]}</div>
        </div>
        <div class="row">
            <div class="col-4">Para Birimi: </div>
            <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
        </div>
    </div>
        `;

            document.querySelector("#details").style.opacity = 1;
            document.querySelector("#country-details").innerHTML = html;
        };

        /* alınan bilgilerin gösterilmesi */
        function renderNeighbors(data) {
            console.log(data);
            let html = "";
            for (let country of data) {
                html += `
                <div class="col-sm-3 mt-2">
                    <div class="card">
                        <img src="${country.flags.png}" class="card-img-top">
                        <div class="card-body">
                            <h6 class="card-title">${country.name.common}</h6>
                        </div>
                    </div>
                </div>
            `;

            }
            document.querySelector("#neighbors").innerHTML = html;
        }


        function renderError(err) {
            document.querySelector("#loading").style.display = "none";
            const html = `
        <div class="alert alert-danger">
            ${err.message}
        </div>
        
        `;
            setTimeout(function () {
                document.querySelector("#errors").innerHTML = "";
            }, 2000)
            document.querySelector("#errors").innerHTML = html
        }