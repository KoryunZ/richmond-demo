# Shot list: rebuilding the film around one locked car

Status on 23 Nov 2026. Nothing in this file has been generated as video yet. The key frames exist (they are
free to make in Flow); the video clips need Flow credits.

## The idea

The brief: one yellow SUV, always heading right to left, the camera following it, the places changing around it.

The footage so far could not do that, because every scene was generated on its own: the car sits in a different
part of the frame, at a different size and angle, in each one. Joining two such scenes forces the generator to
blend from one view of the car to another, and that is where the car jumped, turned round or dissolved.

The fix is to lock the car first and build everything else around it:

1. **Key frames.** Five still pictures, one per chapter, all edited from the same frame. In every one the car is
   in the same place in the picture, the same size, at the same angle (front three-quarter, nose pointing to the
   lower left), in the right half of the frame. Only the place and the light differ.
2. **Clips from key frame to key frame.** Each clip is generated with one key frame as its first frame and the
   next as its last frame. The car does not have to go anywhere in the picture, so the generator only has to
   keep it driving and change the world behind it.
3. The clips are laid end to end. The last frame of one is the first frame of the next, so there is nothing to
   cut, dissolve or mirror.

## Key frames (in the Flow project "нояб. 19 - 17:35", Images; screen captures of them in `clips/key-frames/`)

| Name in Flow | Chapter | Picture |
|---|---|---|
| `KEY1-highway-day` | 1 No deposit | Dubai highway by day, skyline with Burj Khalifa behind |
| `KEY2-night-recovery-truck` | 2 24/7 recovery | the same highway at night, a white flatbed recovery truck with amber beacons in the far lane, ahead of the car |
| `KEY3-rental-forecourt` | 3 From $400 | forecourt of a rental centre in the morning, a row of parked premium cars and SUVs, glass showroom, palms |
| `KEY4-desert-road` | 4 SUV | desert road, dunes, dust. This is frame 0 of the existing clip `scene4-desert.mp4` |
| `b4_first.png` | 4 SUV (end) | the last frame of `scene4-desert.mp4`: the car has come round to face the camera |
| `KEY5-downtown-dusk` | 5 Sport & luxury | Downtown boulevard at blue hour, Burj Khalifa, wet asphalt, headlights on. Edited from `b4_first.png`, so the car sits exactly where the desert clip leaves it |

KEY1, KEY2 and KEY3 were edited from KEY4, and KEY5 from the desert clip's last frame. That is why the car lines
up in all of them.

## What exists and what happens to it

| File | Now | In the rebuilt film |
|---|---|---|
| `scene1-marina.mp4` | chapter 1 | replaced by the start of `t12` |
| `bridge1-day-to-night.mp4` | 1 → 2 | replaced by `t12` (it blends between two views of the car) |
| `scene2-night.mp4` | chapter 2 | replaced by the end of `t12` / start of `t23` (no recovery truck in it) |
| `bridge2-night-to-lot-take2.mp4` | 1st half + last second | replaced by `t23` (the car turns and drives off to the right half-way) |
| `scene3-rental-lot.mp4` | chapter 3, **mirrored** | replaced by the end of `t23` (the clip shows the car's other side; mirroring is not a fix) |
| `bridge3-lot-to-desert.mp4` | last 2.5 s | replaced by `t34` (the car drives away and turns round) |
| `scene4-desert.mp4` | chapter 4 | **kept**: good footage, car heads left the whole time |
| `bridge4-desert-to-downtown.mp4` | 4 → 5 | replaced by `t45` (the car jumps into the distance half-way) |
| `scene5-downtown.mp4` | chapter 5 | replaced by the end of `t45` |

## Settings for every clip

Model **Veo 3.1 - Lite**, 8 seconds, 16:9, 1 output, first frame + last frame as listed. 10 credits each on the
free plan (50 credits a day). Download at the original size and save into `clips/` under the file name given.

## The block every prompt starts with

Paste this in front of each shot description, unchanged:

```
VEHICLE: the lime-yellow Lamborghini Urus from the first frame: bright lime-yellow paint, carbon-fibre bonnet
with a yellow centre stripe, carbon roof, black wheels, red brake calipers. It is the same car in every frame:
the same model, colour, body shape, wheels, proportions and details. Never replace it, restyle it or add a
second yellow car.
DIRECTION: the car drives forward the whole time, from the right of the screen toward the left. Its nose always
points to the left of the picture. It never turns round, never reverses, never drives toward the right and never
leaves the frame.
CAMERA: one continuous cinematic tracking shot from the car's front-left side, at car height, travelling with the
car at exactly the car's speed. The camera stays on that side of the car for the whole shot. It never goes
behind the car, never crosses to its other side, never cuts and never zooms.
FRAMING: the car stays exactly where it is in the first frame, in the right half of the picture, the same size and
at the same angle, from the first frame to the last. Only its wheels turn; the road and everything behind the
car slide past from left to right.
CONTINUITY: a single uninterrupted take. No cuts, no cross-fades, no dissolves, no flashes, no fade to black, no
mirrored or flipped picture. Nothing appears or disappears in mid-air: whatever enters or leaves does so
through an edge of the frame or by the scenery sliding past.
STYLE: photorealistic premium automotive commercial, natural colours, realistic reflections and shadows. No text,
no logos, no people.
```

## Phase 1: the continuous film (4 clips, 40 credits, one day of free credits + 10 spare for one retry)

### `t12-highway-day-to-night-recovery.mp4`: first `KEY1-highway-day`, last `KEY2-night-recovery-truck`

```
SHOT: the car drives along a wide Dubai highway on a clear day, the city skyline in the distance. For the first
two seconds nothing changes but the road moving past. Then the day ends around the moving car: the sun sinks,
the sky turns orange and then deep blue, the street lamps along the road come on and the skyline lights up. As
night falls, a clean white flatbed recovery truck with amber beacon lights on its cab comes into view from the
left edge of the frame in the far lane, driving the same way as the car, and settles a little ahead of the car
and further from the camera. For the last two seconds only the driving continues: night highway, the car's
headlights on, the recovery truck in the far lane with its beacons flashing.
```

### `t23-night-recovery-to-rental.mp4`: first `KEY2-night-recovery-truck`, last `KEY3-rental-forecourt`

```
SHOT: night highway, the white recovery truck driving in the far lane ahead of the car. For the first second only
the driving. Then the truck pulls ahead and leaves through the left edge of the frame while the night ends
around the moving car: the sky pales through dawn into a clear morning, the street lamps go out, and the
highway guard rail gives way to the paved forecourt of a premium car rental centre. A glass showroom with palm
trees and a long row of parked luxury cars and large SUVs slide past behind the car from left to right. The car
slows down gently and its headlights go off. For the last two seconds the car rolls slowly across the forecourt
past the parked cars.
```

### `t34-rental-to-desert.mp4`: first `KEY3-rental-forecourt`, last `KEY4-desert-road`

```
SHOT: the car rolls across the rental forecourt past the row of parked cars and gathers speed. The parked cars,
the palm trees and the glass building slide away to the right behind it; the paving becomes an open asphalt
road; the city thins out, and tall golden sand dunes rise behind the road under a hazy warm sky. A little sand
dust starts to trail behind the rear wheels. For the last two seconds: the desert road, the dunes, the dust.
```

### `t45-desert-to-downtown-dusk.mp4`: first `b4_first.png`, last `KEY5-downtown-dusk`

The desert clip ends with the camera in front of the car, so this shot uses a different CAMERA and FRAMING line.
Replace those two lines of the block with:

```
CAMERA: one continuous tracking shot from in front of the car, slightly to the car's left, at car height, moving
backward ahead of the car at exactly the car's speed. It never goes behind the car, never cuts, never zooms.
FRAMING: the car stays exactly where it is in the first frame, in the middle of the picture, the same size and at
the same angle, driving toward the camera and to the lower left. Only its wheels turn; the road runs under it.
```

```
SHOT: the car drives fast along a desert road, sand dust trailing behind it. The sun sets around the moving car:
the light turns gold and then blue; the dunes sink away and the lit towers of Downtown Dubai with Burj Khalifa
rise behind the car; street lamps and lit shop fronts appear along the road; the dust thins out and is gone;
the asphalt turns dark and slightly wet and reflects the lights; the car's headlights glow. For the last two
seconds: the car driving down the Downtown boulevard at blue hour, the closing hero shot.
```

When the four files are in `clips/`, run `npm run frames`. `tools/frames.py` switches to them by itself (its
`NEXT` list); then tune the frame numbers in `NEXT_CHAPTERS` so each title comes up when its place has arrived.

## Phase 2: the recovery story (not started; at least 5 more clips)

The brief describes the truck stopping, lowering its bed, the SUV driving on, being secured and lifted, the truck
driving to the rental centre and the SUV driving off. That is five shots, each one harder for the generator than
anything above (moving machinery, two vehicles touching). Expect retries: realistically 80 to 150 credits, which
is two to three days of free credits or a paid plan. Each shot needs its own key frame first (free to make).

| Clip | First → last | What happens |
|---|---|---|
| `r1-truck-stops.mp4` | KEY2 → KR1 | car and truck slow down and pull over; the truck stops ahead of the car, its bed slides back and tilts until the ramp touches the road in front of the car |
| `r2-car-drives-on.mp4` | KR1 → KR2 | the car drives forward, right to left, up the ramp onto the bed and stops |
| `r3-truck-leaves.mp4` | KR2 → KR3 | the wheels are strapped, the bed levels and slides forward, the truck pulls away right to left carrying the car |
| `r4-to-the-rental.mp4` | KR3 → KR4 | the camera tracks the truck; night turns to morning; it arrives at the rental forecourt and stops |
| `r5-car-comes-off.mp4` | KR4 → KEY3 | see below |

Two things in the brief cannot both be true here, and they need a decision before `r5` is made:

- **A car that drives onto a flatbed nose first can only come off backwards.** If the truck travels right to left
  and the car drove on right to left, the car leaves the bed moving left to right. "Always right to left" and
  "drives down from the platform" contradict each other. The options: (a) do not show the unloading: go from the
  truck standing at the forecourt straight to the car rolling past the parked cars (`KEY3`), with a slow
  dissolve at the same spot; (b) show the car backing down the ramp for two seconds, the one moment it moves
  the other way.
- **The car has to stop** while it is loaded, and during `r3`/`r4` it is carried rather than driving. That is in
  the story as written, but it means the film is no longer one unbroken tracking shot of a driving car.

Phase 2 replaces `t23`. Phase 1 does not depend on it.
