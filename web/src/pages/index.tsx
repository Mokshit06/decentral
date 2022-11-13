export default function Home() {
  return (
    <div className="cover">
      <div className="image">
        <div>
          <h1>Decentral</h1>
          <p>The decentralised central inbox!</p>
          <a className="link" href="#">
            Try it
          </a>
        </div>
      </div>
      <div className="why-solution">
        <h2></h2>
        <p>
          Navigation is central to driving and every car should have a
          live-updating map tailored to the brand and purpose of the vehicle. We
          designed Sakaram from the ground up, building on live data sourced
          from millions of sensors and a gorgeous design that is fully
          customizable to match the trim of each model.
        </p>
      </div>
      <div className="features">
        <div className="flex">
          <div className="flex-image">
            <img src="/traffic.jpg" alt="" />
          </div>
          <div className="flex-info">
            <h2>Live traffic and accurate routes, powered by AI</h2>
            <p>
              Drivers can avoid congestion and arrive on time with live traffic
              created from the over 300 million miles of anonymized telemetry
              data we collect each day, based on which we provide them with the
              shortest route.
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex-info">
            <h2>Voice assistance</h2>
            <p>
              Drivers can use voice assistant to search for new destinations, or
              add stops to an existing route maximizing time with hands on the
              wheel and eyes on the road. Just say &quot;Directions from
              `origin` to `destination`&quot;.
            </p>
          </div>
          <div className="flex-image">
            <img src="/voice.jpg" alt="" />
          </div>
        </div>
        <div className="flex">
          <div className="flex-image">
            <img src="/music.jpg" alt="" />
          </div>
          <div className="flex-info">
            <h2>Music</h2>
            <p>
              In-map audio controls allow the drivers to see the current song
              playing and skip forward/backward and pause/play songs with
              minimum interruption from navigation. Audio controls support any
              sources on your head unit including streaming music, podcast,
              bluetooth and radio.
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex-info">
            <h2>Built-in browser</h2>
            <p>
              Get access to the entire web platform directly in your car. The
              built-in browser integrates seamlessly with your car and
              automatically shows you nearby gas stations when the fuel goes
              below a specific amount and works with the voice assistant
            </p>
          </div>
          <div className="flex-image">
            <img src="/browser.jpg" alt="" />
          </div>
        </div>
      </div>
      <div className="try-wrapper">
        <div className="try-container">
          <div className="try-text">
            <h2>Try it right now!</h2>
            <p>
              Try Sakaram and let yourself decide whether this is the best car
              dashboard interface ever or not!
            </p>
            <a className="link" href={process.env.NEXT_PUBLIC_DASHBOARD_URL}>
              Try
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
