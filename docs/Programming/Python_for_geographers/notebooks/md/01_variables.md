---
icon: material/emoticon-happy 
---

# ცვლადები

წარმოდგენილი პითონის კოდები შეგიძლია გამოსცადო ღრუბლოვან-გამოთვლით პლატფორმებზე, ყოველგვარი ინსტალაციის გარეშე კომპიუტერზე.

[![image](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/GIS-Edu-Georgia/GIS_OS_Doc/blob/master/docs/Programming/Python_for_geographers/notebooks/ipynb/01_variables.ipynb)


| **HCODE** | **NAMN1**                  | **NAMA1**                     | **NAML1**                      |
|:---------:|:--------------------------:|:-----------------------------:|:------------------------------:|
| GE-TB     | თბილისი                    | Tbilisi                       | tbilisi                        |
| GE-SZ     | სამეგრელო-ზემო სვანეთი     | Samegrelo-Zemo Svaneti        | samegrelo-zemo svaneti         |
| GE-MM     | მცხეთა-მთიანეთი            | Mtskheta-Mtianeti             | mtskheta-mtianeti              |
| GE-KA     | კახეთი                     | Kakheti                       | k'akheti                       |
| GE-GU     | გურია                      | Guria                         | guria                          |
| GE-RL     | რაჭა-ლეჩხუმი-ქვემო სვანეთი | Racha-Lechkhumi-Kvemo Svaneti | rach'a-lechkhumi-kvemo svaneti |
| GE-KK     | ქვემო ქართლი               | Kvemo Kartli                  | kvemo kartli                   |
| GE-SJ     | სამცხე-ჯავახეთი            | Samtskhe-Javakheti            | samtskhe-javakheti             |
| GE-AJ     | აჭარა                      | Adjara                        | ach'ara                        |
| GE-IM     | იმერეთი                    | Imereti                       | imereti                        |
| GE-SK     | შიდა ქართლი                | Shida Kartli                  | shida kartli                   |
| GE-AB     | აფხაზეთი                   | Apkhazeti                     | apkhazeti                      |




## ტექსტური ტიპის მონაცემები - Strings 


ტექსტი ეს არის მიმდევრობა ასოების, რიცხვების და პუნქტუაციის ნიშნების  - **text_123**


პითონში შესაძლებელია ტექსტური ტიპის ინფორმაციის შექმნა ერთ ან ორმაგ ბრჭყალებში



```py title="strings" linenums="1"
city = 'Chiatura'
region = 'Imereti'
print(city, region)

#პრინტ ფუნქცია დაბეჭდავს >  Chiatura Imereti
```

```python title="strings" linenums="1"
print(city +' '+region)

#პრინტ ფუნქცია დაბეჭდავს და შუაში დამატებით სივრცე ექნება >  Chiatura Imereti 
```

```python title="strings" linenums="1"
print(city + ',' + region)

#პრინტ ფუნქცია დაბეჭდავს შუაში მძიმით  >  Chiatura,Imereti 
```
    

## რიცხვითი ტიპის მონაცემები - Numbers

პითონი მუშაობს სხვადასხვა ტიპის რიცხვებთან, მათგან ყველაზე გავრცელებულია:

- **int**, მთელი რიცხვები, მაგალითად 100,
- **float**,  ასევე ათწილადი,  0.5


```python title="Numbers" linenums="1"
population = 12049
latitude =  42.289449
longitude =  43.284585

print(type(latitude))

#პრინტ ფუნქცია დაბეჭდავს latitude ცვლადში არსებულ მონაცემის ტიპს 
#42.289449, ანუ ათწილადი <class 'float'>
```

```python
area_sqkm = 54.5
density = population / area_sqkm
print(density)

#პრინტ ფუნქცია დაბეჭდავს მოსახლეობის სიმჭიდროვეს 221.08256880733944
```

