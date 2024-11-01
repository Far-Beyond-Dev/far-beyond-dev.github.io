---
title: Getting Started
image: 
tags: [basics, tutorial]
stability: stable
excerpt: Quick start guide for Pulsar Engine development
---

# Content starts here...

# Heading 1
## Heading 2
### eading 3
#### Heading 4
##### Heading 5
###### Heading 6	

# Image
![MyImage](https://media.istockphoto.com/id/816752606/photo/tv-test-card-or-test-pattern-generic.jpg?s=612x612&w=0&k=20&c=63Jcx_5bFnvBw9elRDLrLKjtDYXr70pKtUK0jXJ2_uY=)
<video src="https://file-examples.com/storage/fee7a7e285671bd4a9d4d9d/2017/04/file_example_MP4_480_1_5MG.mp4" width="320" height="240" controls></video>
---

Paragraph
text `Inline Code` text		
~~Mistaken text.~~	
*Italics*	
**Bold**	

---

Tasks
- [ ] a task list item
- [ ] list syntax required
- [ ] normal **formatting**
- [ ] incomplete
- [x] completed

---

Code Blocks

    4 space indention
    makes full-width
    standard code blocks

```js
var now = new Date();

var days = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');

var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

var date = ((now.getDate()<10) ? "0" : "")+ now.getDate();

function fourdigits(number)	{
	return (number < 1000) ? number + 1900 : number;
								}
today =  days[now.getDay()] + ", " +
         months[now.getMonth()] + " " +
         date + ", " +
         (fourdigits(now.getYear())) ;

document.write(today);
```

```css
#sc_drag_area {
  height:100px;
  left:150px;
  position: absolute;
  top:100px;
  width:250px;
  z-index: 9999;
}
```

---

* List item one
* List item two
    * A nested item

---

1. Number list item one		
	1.1. A nested item
2. Number list item two
3. Number list item three

---

> Quote
> 
> Second line Quote

---

Standard link =  http://ghost.org	
[Custom Text Link](http://ghost.org)

---

![Image](https://dl.dropboxusercontent.com/u/41297054/Pic.jpeg)

---

Table

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
