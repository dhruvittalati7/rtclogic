/* tslint:disable:max-line-length */
import * as React from 'react'
import { mem } from 'src/utils/mem'

interface Props {
  className?: string
}

export const LogoPerfecta = mem(({ className }: Props) => (
  <svg className={className} viewBox="0 0 298 312" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentColor" fillRule="evenodd">
      <g transform="translate(0 0)">
        <path d="M207,131 C205,131.666667 202.666667,131 200,129 C197.333333,127 195,124.666667 193,122 C192.333333,132 194.333333,137.333333 199,138 C203.666667,138.666667 206.333333,136.333333 207,131 Z" />
        <path d="M0,0 L284,0 L284,204 L142,296 L0,204 L0,0 Z M31,30 L31,185 L105,233 C109.666667,200.333333 122.333333,179.333333 143,170 C174,156 201,161 206,164 C211,167 213,172 213,175 C213,177 212,179.333333 210,182 C224.666667,178.666667 232,173 232,165 C232,157 227,148 217,138 C217.666667,128.666667 216.666667,122.666667 214,120 C210,116 196,94 177,87 C164.333333,82.3333333 146.333333,81 123,83 L203,30 L31,30 Z" />
      </g>
    </g>
  </svg>
))
