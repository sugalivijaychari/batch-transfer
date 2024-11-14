// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TokenCheck {
    IERC721 public erc721Contract;

    constructor(address _erc721Address) {
        erc721Contract = IERC721(_erc721Address);
    }

    // New function to get missing tokens without changing state
    function getMissingTokens(
        uint256 startSRNumber,
        uint256 endSRNumber,
        address from
    ) public view returns (uint256[] memory) {
        require(
            startSRNumber <= endSRNumber,
            "Invalid range: start must be <= end"
        );

        uint256[] memory tempMissingTokens = new uint256[](
            endSRNumber - startSRNumber + 1
        );
        uint256 count = 0;

        for (
            uint256 tokenId = startSRNumber;
            tokenId <= endSRNumber;
            tokenId++
        ) {
            if (erc721Contract.ownerOf(tokenId) != from) {
                tempMissingTokens[count] = tokenId;
                count++;
            }
        }

        // Resize the array to contain only the missing tokens
        uint256[] memory missingTokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            missingTokens[i] = tempMissingTokens[i];
        }

        return missingTokens;
    }

    // Function to perform batch transfer
    function batchTransfer(
        uint256 startSRNumber,
        uint256 endSRNumber,
        address from,
        address to
    ) external {
        require(
            startSRNumber <= endSRNumber,
            "Invalid range: start must be <= end"
        );

        for (
            uint256 tokenId = startSRNumber;
            tokenId <= endSRNumber;
            tokenId++
        ) {
            if (erc721Contract.ownerOf(tokenId) == from) {
                erc721Contract.safeTransferFrom(from, to, tokenId);
            }
        }
    }

    function batchTransferWithMissingTokens(
        uint256 startSRNumber,
        uint256 endSRNumber,
        address from,
        address to
    ) external returns (uint256[] memory) {
        require(
            startSRNumber <= endSRNumber,
            "Invalid range: start must be <= end"
        );

        uint256[] memory tempMissingTokens = new uint256[](
            endSRNumber - startSRNumber + 1
        );
        uint256 count = 0;

        for (
            uint256 tokenId = startSRNumber;
            tokenId <= endSRNumber;
            tokenId++
        ) {
            // Check ownership and attempt transfer
            if (erc721Contract.ownerOf(tokenId) == from) {
                // Attempt transfer
                try erc721Contract.safeTransferFrom(from, to, tokenId) {
                    // Transfer succeeded, do nothing
                } catch {
                    // Transfer failed, add to missing tokens
                    tempMissingTokens[count] = tokenId;
                    count++;
                }
            } else {
                // If `from` does not own the token, add to missing tokens
                tempMissingTokens[count] = tokenId;
                count++;
            }
        }

        // Resize the array to contain only the missing tokens
        uint256[] memory missingTokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            missingTokens[i] = tempMissingTokens[i];
        }

        return missingTokens;
    }
}
