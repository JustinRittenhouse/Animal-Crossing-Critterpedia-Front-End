import { createContext, useCallback, useEffect, useState } from 'react';

export const BugContext = createContext()

export const BugProvider = (props) => {
  return (
    <div>BugProvider</div>
  )
}