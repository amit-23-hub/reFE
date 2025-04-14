import React from "react";
import styles from "./ProfileHeader.module.css";
import img from "../../assets/HomeImg.png";

const ProfileHeader = ({ profileData }) => {
  return (
    <>
      <div className={styles.profileSection}>
        {/* Left Section - Profile and Completion */}
        <div className={styles.leftSection}>
          <div className={styles.profileColumn}>
            <div className={styles.profileBasicInfo}>
              <img src={img} alt="profile" className={styles.profileImage} />
              <div className={styles.profileText}>
                <h2>{profileData.name}</h2>
                <p>{profileData.title}</p>
              </div>
            </div>
            <div className={styles.completionColumn}>
              <div className={styles.completionSection}>
                <div className={styles.completionText}>
                  <span>Profile completion</span>
                  <span>{profileData.completion}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{ width: `${profileData.completion}%` }}
                  ></div>
                </div>
                <p className={styles.completionNote}>
                  Complete your profile for better matches
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stats */}
        <div className={styles.statsInfo}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="2.74043" fill="#F7EBFF" />
                <g clip-path="url(#clip0_2_17601)">
                  <path
                    opacity="0.2"
                    d="M20.0004 22.5685C16.3927 22.5742 12.8476 21.6257 9.72461 19.8194V28.5632C9.72461 28.6757 9.74676 28.787 9.7898 28.8909C9.83283 28.9948 9.89591 29.0893 9.97544 29.1688C10.055 29.2483 10.1494 29.3114 10.2533 29.3544C10.3572 29.3975 10.4685 29.4196 10.581 29.4196H29.4215C29.5339 29.4196 29.6453 29.3975 29.7492 29.3544C29.8531 29.3114 29.9475 29.2483 30.027 29.1688C30.1066 29.0893 30.1696 28.9948 30.2127 28.8909C30.2557 28.787 30.2779 28.6757 30.2779 28.5632V19.8184C27.1545 21.6254 23.6088 22.5742 20.0004 22.5685Z"
                    fill="#8A01DA"
                  />
                  <path
                    d="M29.4215 14.0039H10.581C10.108 14.0039 9.72461 14.3873 9.72461 14.8603V28.5625C9.72461 29.0354 10.108 29.4188 10.581 29.4188H29.4215C29.8944 29.4188 30.2779 29.0354 30.2779 28.5625V14.8603C30.2779 14.3873 29.8944 14.0039 29.4215 14.0039Z"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.2836 14.0037V12.2909C24.2836 11.8366 24.1031 11.401 23.7819 11.0798C23.4607 10.7586 23.0251 10.5781 22.5708 10.5781H17.4325C16.9782 10.5781 16.5426 10.7586 16.2214 11.0798C15.9002 11.401 15.7197 11.8366 15.7197 12.2909V14.0037"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M30.278 19.8184C27.1547 21.6254 23.6089 22.5742 20.0005 22.5685C16.3927 22.5742 12.8476 21.6257 9.72461 19.8193"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.7188 19.1426H21.2879"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_17601">
                    <rect
                      width="27.4043"
                      height="27.4043"
                      fill="white"
                      transform="translate(6.29785 6.29688)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <div>
              <span>{profileData.experience}</span>
              <p>Experience</p>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="2.74043" fill="#F7EBFF" />
                <g clip-path="url(#clip0_2_17601)">
                  <path
                    opacity="0.2"
                    d="M20.0004 22.5685C16.3927 22.5742 12.8476 21.6257 9.72461 19.8194V28.5632C9.72461 28.6757 9.74676 28.787 9.7898 28.8909C9.83283 28.9948 9.89591 29.0893 9.97544 29.1688C10.055 29.2483 10.1494 29.3114 10.2533 29.3544C10.3572 29.3975 10.4685 29.4196 10.581 29.4196H29.4215C29.5339 29.4196 29.6453 29.3975 29.7492 29.3544C29.8531 29.3114 29.9475 29.2483 30.027 29.1688C30.1066 29.0893 30.1696 28.9948 30.2127 28.8909C30.2557 28.787 30.2779 28.6757 30.2779 28.5632V19.8184C27.1545 21.6254 23.6088 22.5742 20.0004 22.5685Z"
                    fill="#8A01DA"
                  />
                  <path
                    d="M29.4215 14.0039H10.581C10.108 14.0039 9.72461 14.3873 9.72461 14.8603V28.5625C9.72461 29.0354 10.108 29.4188 10.581 29.4188H29.4215C29.8944 29.4188 30.2779 29.0354 30.2779 28.5625V14.8603C30.2779 14.3873 29.8944 14.0039 29.4215 14.0039Z"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.2836 14.0037V12.2909C24.2836 11.8366 24.1031 11.401 23.7819 11.0798C23.4607 10.7586 23.0251 10.5781 22.5708 10.5781H17.4325C16.9782 10.5781 16.5426 10.7586 16.2214 11.0798C15.9002 11.401 15.7197 11.8366 15.7197 12.2909V14.0037"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M30.278 19.8184C27.1547 21.6254 23.6089 22.5742 20.0005 22.5685C16.3927 22.5742 12.8476 21.6257 9.72461 19.8193"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.7188 19.1426H21.2879"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_17601">
                    <rect
                      width="27.4043"
                      height="27.4043"
                      fill="white"
                      transform="translate(6.29785 6.29688)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <div>
              <span>{profileData.location}</span>
              <p>Location</p>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="2.74043" fill="#F7EBFF" />
                <g clip-path="url(#clip0_2_17601)">
                  <path
                    opacity="0.2"
                    d="M20.0004 22.5685C16.3927 22.5742 12.8476 21.6257 9.72461 19.8194V28.5632C9.72461 28.6757 9.74676 28.787 9.7898 28.8909C9.83283 28.9948 9.89591 29.0893 9.97544 29.1688C10.055 29.2483 10.1494 29.3114 10.2533 29.3544C10.3572 29.3975 10.4685 29.4196 10.581 29.4196H29.4215C29.5339 29.4196 29.6453 29.3975 29.7492 29.3544C29.8531 29.3114 29.9475 29.2483 30.027 29.1688C30.1066 29.0893 30.1696 28.9948 30.2127 28.8909C30.2557 28.787 30.2779 28.6757 30.2779 28.5632V19.8184C27.1545 21.6254 23.6088 22.5742 20.0004 22.5685Z"
                    fill="#8A01DA"
                  />
                  <path
                    d="M29.4215 14.0039H10.581C10.108 14.0039 9.72461 14.3873 9.72461 14.8603V28.5625C9.72461 29.0354 10.108 29.4188 10.581 29.4188H29.4215C29.8944 29.4188 30.2779 29.0354 30.2779 28.5625V14.8603C30.2779 14.3873 29.8944 14.0039 29.4215 14.0039Z"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.2836 14.0037V12.2909C24.2836 11.8366 24.1031 11.401 23.7819 11.0798C23.4607 10.7586 23.0251 10.5781 22.5708 10.5781H17.4325C16.9782 10.5781 16.5426 10.7586 16.2214 11.0798C15.9002 11.401 15.7197 11.8366 15.7197 12.2909V14.0037"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M30.278 19.8184C27.1547 21.6254 23.6089 22.5742 20.0005 22.5685C16.3927 22.5742 12.8476 21.6257 9.72461 19.8193"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.7188 19.1426H21.2879"
                    stroke="#8A01DA"
                    stroke-width="1.37022"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_17601">
                    <rect
                      width="27.4043"
                      height="27.4043"
                      fill="white"
                      transform="translate(6.29785 6.29688)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <div>
              <span>{profileData.availability}</span>
              <p>Availability</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
