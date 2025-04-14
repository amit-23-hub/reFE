// CountryCodeDropdown.js
import React, { useState } from 'react';
import styles from './CountryCodeDropdown.module.css';

const countryCodes = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  // Add more countries as needed
];

const CountryCodeDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCountry = countryCodes.find(country => country.code === value) || countryCodes[0];

  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  return (
    <div className={styles.dropdownContainer}>
      <div 
        className={styles.dropdownHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.flag}>{selectedCountry.flag}</span>
        <span className={styles.code}>{selectedCountry.code}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className={styles.dropdownList}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <ul>
            {filteredCountries.map((country) => (
              <li
                key={country.code}
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={value === country.code ? styles.selectedItem : ''}
              >
                <span className={styles.flag}>{country.flag}</span>
                <span className={styles.countryName}>{country.name}</span>
                <span className={styles.countryCode}>{country.code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryCodeDropdown;