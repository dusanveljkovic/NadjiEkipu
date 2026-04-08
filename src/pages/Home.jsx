import {useState, useMemo} from "react";

const hobbies = [
  "Fudbal",
  "Kosarka",
  "Kuvanje",
  "Fotografija",
  "Voznja bicikla",
  "Ucenje"
]

const cities = [
  "Beograd",
  "Novi Sad",
  "Niš",
  "Kragujevac",
  "Kraljevo",
  "Novi Pazar"
]

const mockActivities = [
  {
    id: 1,
    hobby: "Fudbal",
    date: "2026-04-10",
    time: "18:00",
    location: "Novi Sad",
    signed: 8,
    max: 10,
  },
  {
    id: 2,
    hobby: "Sah",
    date: "2026-04-10",
    time: "20:00",
    location: "Beograd",
    signed: 3,
    max: 6,
  },
  {
    id: 3,
    hobby: "Ucenje",
    date: "2026-04-11",
    time: "09:00",
    location: "Beograd",
    signed: 5,
    max: 8,
  },
]


function Home() {
  const [search, setSearch] = useState("")
  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [activites, setActivites] = useState(mockActivities)

  const filteredHobbies = hobbies.filter(h => h.toLowerCase().includes(search.toLowerCase()))

  const filteredActivites = useMemo(() => {
    return activites.filter((a) => {
      return (
        (selectedHobbies.length === 0 || selectedHobbies.includes(a.hobby)) &&
        (!startDate || a.date >= startDate) && 
        (!endDate || a.date <= endDate) && 
        (!startTime || a.time >= startTime) && 
        (!endTime || a.time <= endTime) && 
        (!location || a.location === location)
      )
    })
  }, [activites, selectedHobbies, startDate, endDate, startTime, endTime, location])

  const joinActivity = (id) => {}

  const handleSelectedHobby = (hobby => {
    if(selectedHobbies.includes(hobby))
      setSelectedHobbies(selectedHobbies.filter(x => x !== hobby))
    else {
      setSelectedHobbies([...selectedHobbies, hobby])
    }
    console.log(Array.isArray(selectedHobbies))
    console.log(selectedHobbies)
  })

  return (
    <div className="flex flex-col gap-4 p-6 max-w-5xl mx-auto">
      <div className="space-y-4">
        <input type="text" placeholder="Pretrazi interesovanja..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-primary rounded-xl px-4 py-2"/>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredHobbies.map((hobby) => (
          <button key={hobby}
          onClick={() => handleSelectedHobby(hobby)}
          className={`px-3 py-1 rounded-full ${selectedHobbies.includes(hobby) ? "bg-accent text-white border border-md" : "bg-secondary text-white"}`}
          >
            {hobby}
          </button>
        ))}
      </div>
      <div className="flex gap-x-4">
        <div className="flex-4 flex w-full">
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>
        <div className="flex-4 flex w-full">
          <input 
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
          <input 
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-2 w-full border rounded-xl px-3 py-2"
        >
          <option value="">Svi gradovi</option>
          {cities.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <h1 className="text-3xl">Aktivnosti</h1>
      <div className="text-md">
        <div className="flex gap-x-4">
          <span className="flex-5">Ime</span>

          <div className="flex-4 flex items-center justify-center md:flex-row md:items-center md:gap-6">
            <span className="flex-3">Datum i vreme</span>
            <span className="flex-2">Lokacija</span>
            <span className="flex-1">Popunjenost</span>
          </div>
          
          <span className="flex-1"></span>
        </div>
      </div>

      <div className="space-y-3">
        {filteredActivites.map(a => (
          <div 
            key={a.id}
            className="flex items-center border rounded-xl p-4 gap-x-4"
          >
            <span className="flex-5 font-semibold">{a.hobby}</span>
            <div className="flex-4 flex items-end justify-end md:flex-row md:items-center md:gap-6">
              <div className="flex-3 flex flex-col items-center">
                <span className="">{a.date}</span>
                <span>{a.time}</span>
              </div>
              <span className="flex-2">{a.location}</span>
              <span className="flex-1">{a.signed}/{a.max}</span>
            </div>
            <button 
              onClick={() => joinActivity(a.id)}
              className="flex-1 bg-secondary px-4 py-2 rounded-xl text-white"
            >
              Pridruzi se
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button className="px-3 py-1 border rounded">◀</button>
        <span className="px-3 py-1">1 / 5</span>
        <button className="px-3 py-1 border rounded">▶</button>
      </div>
    </div>
    );
}

export default Home;
