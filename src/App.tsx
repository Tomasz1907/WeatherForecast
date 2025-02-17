import Header from './components/Header'
import Search from './components/Search'
import WeekWeather from './components/WeekWeather'
import CurrentWeather from './components/CurrentWeather'

const App = () => {
  
  return (
    <div className='w-screen h-screen bg-gradient-to-b from-blue-300 to-blue-500 text-white text-xl flex flex-col items-center p-5'>
      <div className='w-full flex flex-col items-center gap-5'>
        <Header/>
        <Search/>
        <WeekWeather/>
        <CurrentWeather/>
      </div>
    </div>
  )
}

export default App