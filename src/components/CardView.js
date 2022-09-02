import React, { useState, useMemo, useRef } from 'react'
import TinderCard from './Card'


const db = [
  {
    name: 'Richard Hendricks',
    url: './vid/one.mp4'
  },
  {
    name: 'Erlich Bachman',
    url: './vid/two.mp4'
  },
  {
    name: 'Monica Hall',
    url: './vid/three.mp4'
  },
  {
    name: 'Jared Dunn',
    url: './vid/four.mp4'
  },
  {
    name: 'Dinesh Chugtai',
    url: './vid/one.mp4'
  }
]

function CardView () {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )
  

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < db.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
    
  }


  const outOfFrame = (name, idx) => {
    
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
    
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }


  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }


  return (
    <div>
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
     
      <div className='cardContainer'>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div className='bdra'>

            
            <video loop style={{wdith: 540 , height: 960 }} controls={true} src={character.url}>
            </video>
            </div>
          </TinderCard>
        ))}
      </div>
      
      <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }}  onClick={() => {swipe('left'); }}>Swipe left</button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }}  onClick={() => {swipe('right');  }}>Swipe right</button>
        
      </div>
      
    </div>
  )
  
}

export default CardView
