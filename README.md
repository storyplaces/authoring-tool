StoryPlaces
------------
This application was developed as part of the Leverhulme Trust funded
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
Copyright (c) 2017 University of Southampton

David Millard, dem.soton.ac.uk
Andy Day, a.r.day.soton.ac.uk
Kevin Puplett, k.e.puplett.soton.ac.uk
Charlie Hargood, chargood.bournemouth.ac.uk
David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
- The name of the University of Southampton nor the name of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Installing the authoring tool
-----------------------------
See the server repository README file for a suggested directory structure.
* Copy the `/src/config/Config.ts.default` file as `/src/config/Config.ts`
* Update the `server` path to be the relative path from the reading tool to the server API.
* Update the `reading_tool_url` to be the relative or absolute path to the reading tool url.
* Update the `google_oauth_client_id` to be the client id of your oAuth2 google credential. You will also need to enable to google+ API for your application

* run `npm install`
