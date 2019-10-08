/* tslint:disable:max-line-length */
import React from 'react'
import { mem } from 'src/utils/mem'

export const SvgCollection = mem(() => (
  <div style={{ display: 'none' }}>
    <svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="svg-smile" viewBox="0 0 22 22">
        <defs />
        <path
          d="M1326,840a10,10,0,1,1-10,10,10.014,10.014,0,0,1,10-10m0-1a11,11,0,1,0,11,11,11,11,0,0,0-11-11h0Zm-0.01,17.5a6.531,6.531,0,0,1-3.66-1.124,6.409,6.409,0,0,1-1.74-1.757,0.5,0.5,0,1,1,.82-0.558,5.545,5.545,0,0,0,9.17.016,0.5,0.5,0,1,1,.82.563A6.529,6.529,0,0,1,1325.99,856.5Zm3.51-8.5a0.5,0.5,0,1,1-.5.5,0.5,0.5,0,0,1,.5-0.5m0-1a1.5,1.5,0,1,0,1.5,1.5,1.5,1.5,0,0,0-1.5-1.5h0Zm-7,1a0.5,0.5,0,1,1-.5.5,0.5,0.5,0,0,1,.5-0.5m0-1a1.5,1.5,0,1,0,1.5,1.5,1.5,1.5,0,0,0-1.5-1.5h0Z"
          transform="translate(-1315 -839)"
        />
      </symbol>
      <symbol id="svg-keyboard" viewBox="0 0 28 18">
        <path
          d="M1287.59,841h-23.18a2.392,2.392,0,0,0-2.41,2.368v13.264a2.391,2.391,0,0,0,2.41,2.368h23.18a2.391,2.391,0,0,0,2.41-2.368V843.368A2.392,2.392,0,0,0,1287.59,841Zm1.44,15.632a1.435,1.435,0,0,1-1.44,1.421h-23.18a1.435,1.435,0,0,1-1.44-1.421V843.368a1.435,1.435,0,0,1,1.44-1.421h23.18a1.435,1.435,0,0,1,1.44,1.421v13.264Zm-6.75-2.843h-12.56a0.474,0.474,0,1,0,0,.948h12.56A0.474,0.474,0,1,0,1282.28,853.789Zm-0.49-4.736a0.947,0.947,0,1,0,.97.947A0.954,0.954,0,0,0,1281.79,849.053Zm-3.86,1.894a0.947,0.947,0,1,0-.96-0.947A0.962,0.962,0,0,0,1277.93,850.947Zm-3.86,0a0.947,0.947,0,1,0-.97-0.947A0.954,0.954,0,0,0,1274.07,850.947Zm-3.86,0a0.947,0.947,0,1,0-.97-0.947A0.954,0.954,0,0,0,1270.21,850.947Zm13.51-5.684a0.948,0.948,0,1,0,.97.948A0.954,0.954,0,0,0,1283.72,845.263Zm-3.86,1.895a0.948,0.948,0,1,0-.96-0.947A0.956,0.956,0,0,0,1279.86,847.158Zm-3.86,0a0.948,0.948,0,1,0-.97-0.947A0.962,0.962,0,0,0,1276,847.158Zm-3.86,0a0.948,0.948,0,1,0-.97-0.947A0.954,0.954,0,0,0,1272.14,847.158Zm-3.86-1.895a0.948,0.948,0,1,0,.96.948A0.956,0.956,0,0,0,1268.28,845.263Z"
          transform="translate(-1262 -841)"
        />
      </symbol>
      <symbol id="svg-send" viewBox="0 0 21 20.343">
        <path
          d="M1399.91,840l-19.33,10.137c-0.79.417-.76,1.027,0.08,1.358l2.46,0.976a3.18,3.18,0,0,0,2.81-.4l10.72-8.452c0.7-.556.78-0.474,0.16,0.182l-8.47,9.072a1.027,1.027,0,0,0,.4,1.779l0.29,0.113c0.84,0.323,2.2.866,3.03,1.205l2.74,1.114c0.83,0.338,1.51.619,1.51,0.624a0.209,0.209,0,0,0,.01.021c0.01,0,.2-0.705.44-1.57l4.17-15.338C1401.17,839.946,1400.71,839.579,1399.91,840Zm-11.48,15.678-1.9-.776c-0.83-.339-1.22.059-0.88,0.889,0,0,1.76,4.235,1.71,4.385s1.69-2.514,1.69-2.514A1.3,1.3,0,0,0,1388.43,855.673Z"
          transform="translate(-1380 -839.813)"
        />
      </symbol>
      <symbol id="svg-attach" viewBox="0 0 10.938 25">
        <path className="a" d="M18.75,4.688V19.531a5.276,5.276,0,0,1-.433,2.13,5.513,5.513,0,0,1-2.905,2.905,5.452,5.452,0,0,1-4.26,0,5.513,5.513,0,0,1-2.905-2.905,5.276,5.276,0,0,1-.433-2.13V3.906a3.719,3.719,0,0,1,.311-1.514A4,4,0,0,1,10.205.311a3.836,3.836,0,0,1,3.027,0,4,4,0,0,1,2.081,2.081,3.719,3.719,0,0,1,.311,1.514V19.531a2.3,2.3,0,0,1-.183.916A2.331,2.331,0,0,1,14.2,21.692a2.38,2.38,0,0,1-1.831,0,2.331,2.331,0,0,1-1.245-1.245,2.3,2.3,0,0,1-.183-.916V6.25H12.5V19.531a.781.781,0,0,0,1.563,0V3.906a2.3,2.3,0,0,0-.183-.916,2.331,2.331,0,0,0-1.245-1.245,2.38,2.38,0,0,0-1.831,0A2.331,2.331,0,0,0,9.558,2.991a2.3,2.3,0,0,0-.183.916V19.531a3.719,3.719,0,0,0,.311,1.514,4,4,0,0,0,2.081,2.081,3.836,3.836,0,0,0,3.027,0,4,4,0,0,0,2.081-2.081,3.719,3.719,0,0,0,.311-1.514V4.688Z"
              transform="translate(-7.813)" />
      </symbol>
      <symbol id="svg-attach-img" viewBox="0 0 25 18.75">
        <path className="a" d="M17.969,7.813a.792.792,0,1,1,.549-.232A.751.751,0,0,1,17.969,7.813ZM25,6.25V21.875H3.125V18.75H0V3.125H21.875V6.25ZM19.2,17.188l-4.358-4.37-2.026,2.026,2.356,2.344ZM1.563,4.688v6.7L5.469,7.5l6.25,6.25,3.125-3.125,5.469,5.457V4.688Zm11.389,12.5-7.483-7.5L1.563,13.611v3.577ZM23.438,7.813H21.875V18.75H4.688v1.563h18.75Z"
              transform="translate(0 -3.125)" />
      </symbol>
      <symbol id="svg-attach-img2" viewBox="0 0 50 50">
        <path d="M1,43h48V7H1V43z M3,41v-7.586l11-11l10,10l17-17l6,6V41H3z M47,9v9.586l-6-6l-17,17l-10-10l-11,11V9H47z" />
        <path d="M24,22c2.757,0,5-2.243,5-5s-2.243-5-5-5s-5,2.243-5,5S21.243,22,24,22z M24,14c1.654,0,3,1.346,3,3s-1.346,3-3,3 s-3-1.346-3-3S22.346,14,24,14z" />
      </symbol>
      <symbol id="svg-settings" viewBox="0 0 128 128" fill="currentColor">
        <path d="M61.894,66.056H16.185c-1.104,0-2-0.896-2-2s0.896-2,2-2h45.709c1.104,0,2,0.896,2,2S62.998,66.056,61.894,66.056z" />
        <path d="M111.907,66.056H87.655c-1.104,0-2-0.896-2-2s0.896-2,2-2h24.252c1.104,0,2,0.896,2,2S113.012,66.056,111.907,66.056z" />
        <path d="M48.503,96.609H16.185c-1.104,0-2-0.896-2-2s0.896-2,2-2h32.318c1.104,0,2,0.896,2,2S49.607,96.609,48.503,96.609z" />
        <path d="M111.907,96.609H74.774c-1.104,0-2-0.896-2-2s0.896-2,2-2h37.133c1.104,0,2,0.896,2,2S113.012,96.609,111.907,96.609z" />
        <path d="M35.013,35.502H16.185c-1.104,0-2-0.896-2-2s0.896-2,2-2h18.828c1.104,0,2,0.896,2,2S36.117,35.502,35.013,35.502z" />
        <path d="M111.907,35.502H60.776c-1.104,0-2-0.896-2-2s0.896-2,2-2h51.131c1.104,0,2,0.896,2,2S113.012,35.502,111.907,35.502z" />
        <path d="M42.616,43.104c-5.295,0-9.604-4.309-9.604-9.604c0-5.295,4.309-9.603,9.604-9.603s9.604,4.308,9.604,9.603 C52.22,38.796,47.911,43.104,42.616,43.104z M42.616,27.897c-3.09,0-5.604,2.514-5.604,5.603c0,3.09,2.514,5.604,5.604,5.604 S48.22,36.59,48.22,33.5C48.22,30.411,45.706,27.897,42.616,27.897z" />
        <path d="M56.106,104.215c-5.295,0-9.604-4.309-9.604-9.605c0-5.295,4.309-9.604,9.604-9.604c5.297,0,9.605,4.309,9.605,9.604 C65.712,99.906,61.403,104.215,56.106,104.215z M56.106,89.006c-3.09,0-5.604,2.514-5.604,5.604c0,3.092,2.514,5.605,5.604,5.605 c3.091,0,5.605-2.514,5.605-5.605C61.712,91.52,59.197,89.006,56.106,89.006z" />
        <path d="M69.501,73.661c-5.298,0-9.607-4.31-9.607-9.605c0-5.295,4.31-9.604,9.607-9.604c5.294,0,9.602,4.308,9.602,9.604 C79.103,69.352,74.795,73.661,69.501,73.661z M69.501,58.452c-3.092,0-5.607,2.514-5.607,5.604c0,3.091,2.516,5.605,5.607,5.605 c3.089,0,5.602-2.515,5.602-5.605C75.103,60.966,72.59,58.452,69.501,58.452z" />
      </symbol>
    </svg>
  </div>
))
