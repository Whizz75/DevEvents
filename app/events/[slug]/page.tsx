import { notFound } from "next/navigation";
import Image from "next/image";

import { EventCard } from "@/components/EventCard";
import { BookEvent } from "@/components/BookEvent";
import IEvents from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>{tag}</duv>
      ))}
  </div>
)

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
  const { slug } = await params;
  
  let event;
  try{
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, { next: { revalidate: 60 }
    });
    
    if (!request.ok) {
      if (request.status === 404) return notFound();
      
      throw new Error(`Failed to fetch event: ${request.statusText}`)
    }
    
    const response = await request.json();
    event = response.event;
    
    if (!event) return notFound();
    
  } catch (error) {
    console.error('Error fetching event:', error);
    return notFound();
  }
  
  const { description, overview, image, venue, location, date, time, mode, audience, agenda, organizer, tags } = event;
  
  if (!description) return notFound();
  
  const bookings = 10;
  
  const similarEvents: IEvents[] = await getSimilarEventsBySlug(slug);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      
      <div className="details">
      {/* Left Side - Event Details*/}
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />
          
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="calendar" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="calendar" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="calendar" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="calendar" label={audience} />
          </section>
          
          <EventAgenda agendaItems={agenda} />
          
          <section className="flex-col-gap-2">
            <h2>About The Organizer</h2>
            <p>{organizer}</p>
          </section>
          
          <EventTags tags={tags} />
        </div>
      
      {/* Right Side - Booking Form*/}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book You Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">Join {bookings} people who have already booked their spot!</p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            
            <BookEvent />
          </div>
        </aside>
      </div>
      
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents && similarEvents.length > 0 && similarEvents.map((similarEvent: IEvents) => (
            <EventCard key={similarEvent.title} {...similarEvents}/>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventDetailsPage;