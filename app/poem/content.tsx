"use client"
import React from 'react';
import { TracingBeam } from "../components/ui/tracing-beam";
import styled from 'styled-components';
import { PageTitle } from '../components/page-title';
import { EnterpriseCards } from '../components/enterprise-cards';
import Newsletter from '../components/newsletter';
import ContactMetal from '../components/contact-metal';

const Grid = styled.div`
   display: grid;
   max-width: 1150px;
   grid-template-columns: repeat(3, 2fr);
   column-gap: 15px;
   row-gap: 15px;
  `

export function Content() {
  return (

  <div className='text-center'>
    <TracingBeam className="px-6">
      <PageTitle>A Brief Poem</PageTitle>

      <p>'Twas the night before launch day, and all through the net,<br></br>
    The servers were ready, the staging was set.<br></br>
    The engineers snoozed, snug in their chairs,<br></br>
    In hopes that Horizon would handle the flares.</p>
    <br></br><br></br>

    <p>The code was deployed with meticulous care,<br></br>
    With dreams of smooth gameplay soon in the air.<br></br>
    The players were logging, the servers alive,<br></br>
    With socket.io humming, the data would jive.</p>
    <br></br><br></br>

    <p>When out on the network there arose such a clatter,<br></br>
    I sprang from my desk to see what was the matter.<br></br>
    Away to the dashboard I flew like a flash,<br></br>
    Checked the metrics, no sign of a crash.</p>
    <br></br><br></br>

    <p>The moon on the rise of the newly spun node,<br></br>
    Gave a luster of smoothness to the server load.<br></br>
    When what to my wondering eyes should appear,<br></br>
    But a scalable cluster and data so clear.</p>
    <br></br><br></br>

    <p>With a modular library, so easy to tweak,<br></br>
    I knew in a moment this must be the peak.<br></br>
    More rapid than fiber, the updates they came,<br></br>
    I whistled and shouted, and called them by name:</p>
    <br></br><br></br>

    <p>"Now Enterprise! Now SubSystems! Now customizable flair!<br></br>
    On Scalability! On Fault Tolerance! On performance so rare!<br></br>
    To the top of the charts! To the top of them all!<br></br>
    Now code away! Code away! Code away all!"</p>
    <br></br><br></br>

    <p>As packets that before the wild network fly,<br></br>
    When they meet with a router, they mount to the sky.<br></br>
    So up to the cloud the servers they flew,<br></br>
    With Horizon deployed and scalability too.</p>
    <br></br><br></br>

    <p>And then, in a twinkling, I heard on the wire,<br></br>
    The ping of a player, the speed never dire.<br></br>
    As I drew in my head, and was turning around,<br></br>
    Down came Horizon, stability renowned.</p>
    <br></br><br></br>

    <p>It was dressed all in Rust, from start to deploy,<br></br>
    And the bugs were all gone, leaving nothing to annoy.<br></br>
    A bundle of features it had in its pack,<br></br>
    And it looked like a powerhouse, ready to hack.</p>
    <br></br><br></br>

    <p>Its eyes, how they twinkled! Its performance, how merry!<br></br>
    Its stability, solid, its features so cherry!<br></br>
    Its quick deploy magic, all done with a flash,<br></br>
    Ensured that our servers would never quite crash.</p>
    <br></br><br></br>

    <p>It spoke not a word, but went straight to its work,<br></br>
    And filled all the instances; then turned with a smirk.<br></br>
    And laying its finger aside of its nose,<br></br>
    And giving a nod, up the network it rose.</p>
    <br></br><br></br>

    <p>It sprang to the cloud, to its team gave a whistle,<br></br>
    And away they all flew like the down of a missile.<br></br>
    But I heard it exclaim, ere it drove out of sight,<br></br>
    "Happy gaming to all, and to all a good night!"</p>
      <br></br><br></br>


    </TracingBeam>
    <div className='pt-10'>
    </div>
  </div>
  );
}

export default Content